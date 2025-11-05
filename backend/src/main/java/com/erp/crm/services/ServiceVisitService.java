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

    private void updateVisitMetadata(ServiceVisit visit) {
        User engineer = getCurrentUser();
        visit.setUpdatedAt(LocalDateTime.now());
        visit.setUpdatedBy(engineer.getName());
    }

    public ServiceVisitService(ServiceVisitRepository visitRepo,
            ServiceTicketRepository ticketRepo,
            UserRepository userRepo,
            FileUploadService fileUploadService) {
        this.visitRepo = visitRepo;
        this.ticketRepo = ticketRepo;
        this.userRepo = userRepo;
        this.fileUploadService = fileUploadService;
    }

    // 1️ START VISIT

    public ServiceVisitResponseDTO startVisit(Long ticketId, ServiceVisitRequestDTO dto) {
        ServiceTicket ticket = getTicket(ticketId);
        User engineer = getCurrentUser();

        validateEngineer(ticket, engineer);
        validateTransition(ticket.getServiceStatus(), ServiceStatus.EN_ROUTE);

        // Upload start KM photo if provided
        String photoUrl = uploadPhoto(dto.getStartKmPhoto(), "tickets/" + ticketId + "/start");

        ServiceVisit visit = ServiceVisit.builder()
                .ticket(ticket)
                .engineer(engineer)
                .startKm(dto.getStartKm())
                .startKmPhotoUrl(photoUrl)
                .visitStatus(ServiceStatus.EN_ROUTE)
                .startedAt(LocalDateTime.now())
                .active(true)
                .build();

        updateVisitMetadata(visit);
        visitRepo.save(visit);
        ticket.setServiceStatus(ServiceStatus.EN_ROUTE);
        ticketRepo.save(ticket);

        return toDTO(visit);
    }

    // 2️ MARK ARRIVAL

    public ServiceVisitResponseDTO markArrival(Long visitId) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.ON_SITE);

        visit.setVisitStatus(ServiceStatus.ON_SITE);
        ticket.setServiceStatus(ServiceStatus.ON_SITE);

        updateVisitMetadata(visit);

        visitRepo.save(visit);
        ticketRepo.save(ticket);

        return toDTO(visit);
    }

    // 3️ MARK NEED PART

    public ServiceVisitResponseDTO markNeedPart(Long visitId, VisitStatusUpdateDTO dto) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.NEED_PART);

        visit.setVisitStatus(ServiceStatus.NEED_PART);
        visit.setMissingPart(dto.getMissingPart());
        visit.setRemarks(dto.getRemarks());
        String endPhotoUrl = uploadPhoto(dto.getEndKmPhoto(), "tickets/" + ticket.getId() + "/end");

        visit.setEndKm(dto.getEndKm());
        visit.setEndKmPhotoUrl(endPhotoUrl);
        visit.setUsedParts(dto.getUsedParts());
        visit.setEndedAt(LocalDateTime.now());
        // End current visit only if part unavailable today
        if (dto.isPartUnavailableToday()) {
            visit.setEndedAt(LocalDateTime.now());
            visit.setActive(false);
        }

        ticket.setServiceStatus(ServiceStatus.NEED_PART);
        updateVisitMetadata(visit);

        visitRepo.save(visit);
        ticketRepo.save(ticket);

        return toDTO(visit);
    }

    // 4️ MARK PART COLLECTED (Same Day)
    public ServiceVisitResponseDTO markPartCollected(Long visitId, VisitStatusUpdateDTO dto) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.PART_COLLECTED);

        String partPhotoUrl = uploadPhoto(dto.getPartCollectedPhoto(), "tickets/" + ticket.getId() + "/part");

        visit.setPartCollectedSameDay(true);

        visit.setVisitStatus(ServiceStatus.PART_COLLECTED);

        ticket.setServiceStatus(ServiceStatus.PART_COLLECTED);
        updateVisitMetadata(visit);

        visitRepo.save(visit);
        ticketRepo.save(ticket);

        return toDTO(visit);
    }
    // 5️⃣ MARK FIXED (With or Without Part)

    public ServiceVisitResponseDTO markFixed(Long visitId, VisitStatusUpdateDTO dto) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.FIXED);

        String endPhotoUrl = uploadPhoto(dto.getEndKmPhoto(), "tickets/" + ticket.getId() + "/end");

        visit.setEndKm(dto.getEndKm());
        visit.setEndKmPhotoUrl(endPhotoUrl);
        visit.setUsedParts(dto.getUsedParts());
        visit.setEndedAt(LocalDateTime.now());
        visit.setVisitStatus(ServiceStatus.FIXED);
        visit.setActive(true);

        ticket.setServiceStatus(ServiceStatus.FIXED);

        // Optional shortcut if directly completed
        if (dto.isDirectlyComplete()) {
            visit.setVisitStatus(ServiceStatus.COMPLETED);
            ticket.setServiceStatus(ServiceStatus.COMPLETED);
            visit.setEndedAt(LocalDateTime.now());
            visit.setActive(false);
        }
        updateVisitMetadata(visit);

        visitRepo.save(visit);
        ticketRepo.save(ticket);
        return toDTO(visit);
    }

    // 6️⃣ COMPLETE VISIT

    public ServiceVisitResponseDTO completeVisit(Long visitId, String remarks) {
        ServiceVisit visit = getVisit(visitId);
        ServiceTicket ticket = visit.getTicket();

        validateTransition(ticket.getServiceStatus(), ServiceStatus.COMPLETED);

        visit.setVisitStatus(ServiceStatus.COMPLETED);
        visit.setRemarks(remarks);
        visit.setEndedAt(LocalDateTime.now());
        visit.setActive(false);

        ticket.setServiceStatus(ServiceStatus.COMPLETED);
                updateVisitMetadata(visit);

        visitRepo.save(visit);
        ticketRepo.save(ticket);

        return toDTO(visit);
    }

    // 7️⃣ NEXT-DAY CONTINUATION

    public ServiceVisitResponseDTO startNextDayVisit(Long previousVisitId, ServiceVisitRequestDTO dto) {
        ServiceVisit previous = getVisit(previousVisitId);
        ServiceTicket ticket = previous.getTicket();
        User engineer = getCurrentUser();

        validateEngineer(ticket, engineer);
        validateTransition(ticket.getServiceStatus(), ServiceStatus.NEED_PART);

        String startPhotoUrl = uploadPhoto(dto.getStartKmPhoto(), "tickets/" + ticket.getId() + "/restart");

        ServiceVisit newVisit = ServiceVisit.builder()
                .ticket(ticket)
                .engineer(engineer)
                .previousVisit(previous)
                .startKm(dto.getStartKm())
                .startKmPhotoUrl(startPhotoUrl)
                .visitStatus(ServiceStatus.EN_ROUTE)
                .startedAt(LocalDateTime.now())
                .active(true)
                .build();

        previous.setActive(false); // End old visit
        previous.setEndedAt(LocalDateTime.now());
        updateVisitMetadata(previous);
        visitRepo.save(previous);
        visitRepo.save(newVisit);

        ticket.setServiceStatus(ServiceStatus.EN_ROUTE);
        ticketRepo.save(ticket);

        return toDTO(newVisit);
    }

    // 8️⃣ FETCH VISITS

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

    // 9️⃣ MAPPERS + HELPERS

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
                .ticketStatus(visit.getTicket().getServiceStatus())
                .active(visit.isActive())
                .nextDayRequired(ServiceStatus.NEED_PART.equals(visit.getVisitStatus()) && !visit.isActive())
                .usedParts(visit.getUsedParts())
                .missingPart(visit.getMissingPart())
                .remarks(visit.getRemarks())
                .startedAt(visit.getStartedAt())
                .endedAt(visit.getEndedAt())
                .lastUpdatedBy(visit.getEngineer().getName())
                .lastUpdatedAt(LocalDateTime.now())
                .build();
    }

    private String uploadPhoto(MultipartFile file, String path) {
        return (file != null && !file.isEmpty()) ? fileUploadService.uploadCustom(file, path) : null;
    }

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
            case NEED_PART ->
                allowOnly(next, ServiceStatus.FIXED, ServiceStatus.PART_COLLECTED, ServiceStatus.EN_ROUTE);
            case PART_COLLECTED -> allowOnly(next, ServiceStatus.FIXED, ServiceStatus.ON_SITE);
            case FIXED -> allowOnly(next, ServiceStatus.COMPLETED);
            case COMPLETED, CANCELLED, CLOSED ->
                throw new IllegalStateException("Cannot modify a completed or closed ticket");
            default -> throw new IllegalStateException("Unexpected current status: " + current);
        }
    }

    private void allowOnly(ServiceStatus next, ServiceStatus... allowed) {
        for (ServiceStatus s : allowed)
            if (s == next)
                return;
        throw new IllegalStateException("Invalid transition to: " + next);
    }
}
