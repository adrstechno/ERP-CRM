package com.erp.crm.services;

import com.erp.crm.dto.ServiceReportRequestDTO;
import com.erp.crm.dto.ServiceReportResponseDTO;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import com.erp.crm.security.UserPrincipal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceReportService {

    private final ServiceReportRepository reportRepo;
    private final ServiceTicketRepository ticketRepo;
    private final UserRepository userRepo;
    private final FileUploadService fileUploadService;
    private final ServiceTicketService serviceReportService;

    // Create service report
    public ServiceReportResponseDTO createReport(ServiceReportRequestDTO dto, MultipartFile receipt) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User engineer = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Engineer not found with email: " + email));

        ServiceTicket ticket = ticketRepo.findById(dto.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // One-to-one: check if already reported
        reportRepo.findByTicket_Id(ticket.getId())
                .ifPresent(r -> { throw new RuntimeException("Report already exists for this ticket"); });
        
        // Only completed tickets allowed
        if (ticket.getStatus() != Status.COMPLETED) {
            throw new RuntimeException("You can submit a report only after ticket completion");
        }

        ServiceReport report = new ServiceReport();
        report.setTicket(ticket);
        report.setEngineer(engineer);
        report.setPartsUsed(dto.getPartsUsed());
        report.setAdditionalCharges(dto.getAdditionalCharges());
        report.setDescription(dto.getDescription());

        if (receipt != null && !receipt.isEmpty()) {
            String uploadedUrl = fileUploadService.uploadReceipt(receipt, null);
            report.setReceiptURL(uploadedUrl);
        }

        ServiceReport saved = reportRepo.save(report);
        return ServiceReportResponseDTO.fromEntity(saved);
    }

    // Get reports by current engineer (from token)
    @Transactional(readOnly = true)
    public List<ServiceReportResponseDTO> getReportsByEngineer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User engineer = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Engineer not found with email: " + email));

        return reportRepo.findAllByEngineer_UserId(engineer.getUserId())
                .stream()
                .map(ServiceReportResponseDTO::fromEntity)
                .toList();
    }

    // Get report by ticketId
    @Transactional(readOnly = true)
    public ServiceReportResponseDTO getReportByTicket(Long ticketId) {
        ServiceReport report = reportRepo.findByTicket_Id(ticketId)
                .orElseThrow(() -> new RuntimeException("Report not found for ticket ID: " + ticketId));
        return ServiceReportResponseDTO.fromEntity(report);
    }

    // Admin: Get all reports
    @Transactional(readOnly = true)
    public List<ServiceReportResponseDTO> getAllReports() {
        return reportRepo.findAll().stream()
                .map(ServiceReportResponseDTO::fromEntity)
                .toList();
    }
}
