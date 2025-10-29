package com.erp.crm.services;

import com.erp.crm.dto.*;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import com.erp.crm.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceVisitService {

    private final ServiceVisitRepository visitRepo;
    private final ServiceTicketRepository ticketRepo;
    private final UserRepository userRepo;
    private final FileUploadService fileUploadService;

    public ServiceVisitService(ServiceVisitRepository visitRepo,
                               ServiceTicketRepository ticketRepo,
                               UserRepository userRepo,
                               FileUploadService fileUploadService) {
        this.visitRepo = visitRepo;
        this.ticketRepo = ticketRepo;
        this.userRepo = userRepo;
        this.fileUploadService = fileUploadService;
    }

    public ServiceVisitResponseDTO startVisit(Long ticketId, ServiceVisitRequestDTO dto) {
        ServiceTicket ticket = getTicket(ticketId);
        User engineer = getCurrentUser();

        validateEngineer(ticket, engineer);
        validateTransition(ticket.getServiceStatus(), ServiceStatus.EN_ROUTE);

        String photoUrl = (dto.getStartKmPhoto() != null && !dto.getStartKmPhoto().isEmpty())
                ? fileUploadService.uploadCustom(dto.getStartKmPhoto(), "tickets/" + ticketId + "/start")
                : null;

        ServiceVisit visit = ServiceVisit.builder()
                .ticket(ticket)
                .engineer(engineer)
                .startKm(dto.getStartKm())
                .startKmPhotoUrl(photoUrl)
                .visitStatus(ServiceStatus.EN_ROUTE)
                .startedAt(LocalDateTime.now())
                .active(true)
                .build();

        visitRepo.save(visit);

        ticket.setServiceStatus(ServiceStatus.EN_ROUTE);
        ticketRepo.save(ticket);

        return toDTO(visit);
    }

    public ServiceVisitResponseDTO markArrival(Long visitId) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.ON_SITE);

        visit.setVisitStatus(ServiceStatus.ON_SITE);
        ticket.setServiceStatus(ServiceStatus.ON_SITE);

        visitRepo.save(visit);
        ticketRepo.save(ticket);
        return toDTO(visit);
    }

    public ServiceVisitResponseDTO markNeedPart(Long visitId, VisitStatusUpdateDTO dto) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.NEED_PART);

        visit.setVisitStatus(ServiceStatus.NEED_PART);
        visit.setMissingPart(dto.getMissingPart());
        visit.setRemarks(dto.getRemarks());

        if (dto.isPartUnavailableToday()) {
            visit.setEndedAt(LocalDateTime.now());
            visit.setActive(false);
        }

        ticket.setServiceStatus(ServiceStatus.NEED_PART);
        ticketRepo.save(ticket);
        visitRepo.save(visit);
        return toDTO(visit);
    }

    public ServiceVisitResponseDTO markFixed(Long visitId, VisitStatusUpdateDTO dto) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.FIXED);

        String photoUrl = (dto.getEndKmPhoto() != null && !dto.getEndKmPhoto().isEmpty())
                ? fileUploadService.uploadCustom(dto.getEndKmPhoto(), "tickets/" + ticket.getId() + "/end")
                : null;

        visit.setEndKm(dto.getEndKm());
        visit.setEndKmPhotoUrl(photoUrl);
        visit.setUsedParts(dto.getUsedParts());
        visit.setEndedAt(LocalDateTime.now());
        visit.setVisitStatus(ServiceStatus.FIXED);

        ticket.setServiceStatus(ServiceStatus.FIXED);

        if (dto.isDirectlyComplete()) {
            visit.setVisitStatus(ServiceStatus.COMPLETED);
            ticket.setServiceStatus(ServiceStatus.COMPLETED);
        }

        visitRepo.save(visit);
        ticketRepo.save(ticket);
        return toDTO(visit);
    }

    public ServiceVisitResponseDTO completeVisit(Long visitId, String remarks) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.COMPLETED);

        visit.setVisitStatus(ServiceStatus.COMPLETED);
        visit.setRemarks(remarks);
        visit.setEndedAt(LocalDateTime.now());
        visit.setActive(false);

        ticket.setServiceStatus(ServiceStatus.COMPLETED);
        visitRepo.save(visit);
        ticketRepo.save(ticket);

        return toDTO(visit);
    }

    public List<ServiceVisitResponseDTO> getVisitsByTicket(Long ticketId) {
        ServiceTicket ticket = getTicket(ticketId);
        return visitRepo.findByTicket(ticket)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ServiceVisitResponseDTO> getMyVisits() {
        User engineer = getCurrentUser();
        return visitRepo.findByEngineer(engineer)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ---------- Utility + Mapper Methods ---------- //

    private ServiceVisitResponseDTO toDTO(ServiceVisit visit) {
        return ServiceVisitResponseDTO.builder()
                .id(visit.getId())
                .ticketId(visit.getTicket().getId())
                .engineerName(visit.getEngineer().getName())
                .startKm(visit.getStartKm())
                .startKmPhotoUrl(visit.getStartKmPhotoUrl())
                .endKm(visit.getEndKm())
                .endKmPhotoUrl(visit.getEndKmPhotoUrl())
                .visitStatus(visit.getVisitStatus())
                .usedParts(visit.getUsedParts())
                .missingPart(visit.getMissingPart())
                .remarks(visit.getRemarks())
                .startedAt(visit.getStartedAt())
                .endedAt(visit.getEndedAt())
                .build();
    }

    // ------------------- INTERNAL HELPERS ------------------- //
    private ServiceTicket getTicket(Long id) {
        return ticketRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found for ID: " + id));
    }

    private ServiceVisit getVisit(Long id) {
        return visitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found for ID: " + id));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal))
            throw new RuntimeException("User not authenticated");
        return userRepo.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("Engineer not found"));
    }

    private void validateEngineer(ServiceTicket ticket, User engineer) {
        Long assignedId = ticket.getAssignedEngineer() != null ? ticket.getAssignedEngineer().getUserId() : null;
        if (assignedId == null || !assignedId.equals(engineer.getUserId())) {
            throw new RuntimeException("You are not assigned to this ticket");
        }
    }

    private void validateTransition(ServiceStatus current, ServiceStatus next) {
        switch (current) {
            case ASSIGNED -> allowOnly(next, ServiceStatus.EN_ROUTE);
            case EN_ROUTE -> allowOnly(next, ServiceStatus.ON_SITE);
            case ON_SITE -> allowOnly(next, ServiceStatus.NEED_PART, ServiceStatus.FIXED, ServiceStatus.COMPLETED);
            case NEED_PART -> allowOnly(next, ServiceStatus.FIXED, ServiceStatus.PART_COLLECTED);
            case FIXED -> allowOnly(next, ServiceStatus.COMPLETED);
            case COMPLETED, CANCELLED, CLOSED ->
                    throw new IllegalStateException("Cannot modify a completed or closed ticket");
            default -> throw new IllegalStateException("Unexpected current status: " + current);
        }
    }

    private void allowOnly(ServiceStatus next, ServiceStatus... allowed) {
        for (ServiceStatus s : allowed) if (s == next) return;
        throw new IllegalStateException("Invalid transition to: " + next);
    }
}
