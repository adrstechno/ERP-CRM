package com.erp.crm.services;

import com.erp.crm.dto.ServiceReportRequestDTO;
import com.erp.crm.dto.ServiceReportResponseDTO;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import com.erp.crm.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceReportService {

    private final ServiceReportRepository reportRepo;
    private final ServiceTicketRepository ticketRepo;
    private final UserRepository userRepo;
    private final FileUploadService fileUploadService;
    private final ServiceTicketService ticketService;

    // ✅ Create service report by engineer
    public ServiceReportResponseDTO createReport(ServiceReportRequestDTO dto, MultipartFile receipt) {

        User engineer = getAuthenticatedEngineer();

        // Fetch ticket and ensure valid workflow
        ServiceTicket ticket = ticketRepo.findById(dto.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + dto.getTicketId()));

        // Check if already reported
        reportRepo.findByTicket_Id(ticket.getId())
                .ifPresent(r -> { throw new RuntimeException("Report already exists for this ticket"); });

        // Ticket must be in progress to create report
        if (ticket.getServiceStatus() != ServiceStatus.ON_SITE 
                && ticket.getServiceStatus() != ServiceStatus.IN_PROGRESS) {
            throw new RuntimeException("Report can only be created when ticket is in progress or on-site");
        }

        // Auto update ticket to COMPLETED after report submission
        ticketService.updateWork(ticket.getId(), ServiceStatus.COMPLETED);

        // Create new report entity
        ServiceReport report = new ServiceReport();
        report.setTicket(ticket);
        report.setEngineer(engineer);
        report.setPartsUsed(dto.getPartsUsed());
        report.setAdditionalCharges(dto.getAdditionalCharges());
        report.setDescription(dto.getDescription());

        // Upload receipt if provided
        if (receipt != null && !receipt.isEmpty()) {
            String uploadedUrl = fileUploadService.uploadReceipt(receipt, null);
            report.setReceiptURL(uploadedUrl);
        }

        ServiceReport savedReport = reportRepo.save(report);
        return ServiceReportResponseDTO.fromEntity(savedReport);
    }

    // ✅ Get reports by current engineer (from token)
    @Transactional(readOnly = true)
    public List<ServiceReportResponseDTO> getReportsByEngineer() {
        User engineer = getAuthenticatedEngineer();

        return reportRepo.findAllByEngineer_UserId(engineer.getUserId())
                .stream()
                .map(ServiceReportResponseDTO::fromEntity)
                .toList();
    }

    // ✅ Get report by ticketId
    @Transactional(readOnly = true)
    public ServiceReportResponseDTO getReportByTicket(Long ticketId) {
        ServiceReport report = reportRepo.findByTicket_Id(ticketId)
                .orElseThrow(() -> new RuntimeException("Report not found for ticket ID: " + ticketId));

        return ServiceReportResponseDTO.fromEntity(report);
    }

    // ✅ Admin: Get all reports
    @Transactional(readOnly = true)
    public List<ServiceReportResponseDTO> getAllReports() {
        return reportRepo.findAllByOrderByReportId().stream()
                .map(ServiceReportResponseDTO::fromEntity)
                .toList();
    }

    // 🔒 Utility: fetch authenticated engineer
    private User getAuthenticatedEngineer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        return userRepo.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("Engineer not found"));
    }
}
