package com.erp.crm.controllers;

import com.erp.crm.dto.*;
import com.erp.crm.services.ServiceVisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-visits")
public class ServiceVisitController {

    private final ServiceVisitService visitService;

    public ServiceVisitController(ServiceVisitService visitService) {
        this.visitService = visitService;
    }

    // Start a new visit for a given service ticket
    @PostMapping("/{ticketId}/start")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceVisitResponseDTO> startVisit(
            @PathVariable Long ticketId,
            @ModelAttribute ServiceVisitRequestDTO request
    ) {
        return ResponseEntity.ok(visitService.startVisit(ticketId, request));
    }

    // Mark arrival at customer site
    @PatchMapping("/{visitId}/arrive")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceVisitResponseDTO> markArrival(@PathVariable Long visitId) {
        return ResponseEntity.ok(visitService.markArrival(visitId));
    }

    // Mark visit as needing parts
    @PatchMapping("/{visitId}/need-part")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceVisitResponseDTO> markNeedPart(
            @PathVariable Long visitId,
            @RequestBody VisitStatusUpdateDTO dto
    ) {
        return ResponseEntity.ok(visitService.markNeedPart(visitId, dto));
    }

    // Mark visit as fixed after repair or part replacement
    @PatchMapping("/{visitId}/fixed")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceVisitResponseDTO> markFixed(
            @PathVariable Long visitId,
            @ModelAttribute VisitStatusUpdateDTO dto
    ) {
        return ResponseEntity.ok(visitService.markFixed(visitId, dto));
    }

    // Mark visit as complete and close the record
    @PatchMapping("/{visitId}/complete")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceVisitResponseDTO> completeVisit(
            @PathVariable Long visitId,
            @RequestParam(required = false) String remarks
    ) {
        return ResponseEntity.ok(visitService.completeVisit(visitId, remarks));
    }

    // Get all visits related to a particular service ticket
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('ENGINEER','ADMIN','SUBADMIN')")
    public ResponseEntity<List<ServiceVisitResponseDTO>> getVisitsByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(visitService.getVisitsByTicket(ticketId));
    }

    // Get all visits assigned to the logged-in engineer
    @GetMapping("/my-visits")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<List<ServiceVisitResponseDTO>> getMyVisits() {
        return ResponseEntity.ok(visitService.getMyVisits());
    }
}
