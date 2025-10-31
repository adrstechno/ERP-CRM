package com.erp.crm.controllers;

import com.erp.crm.dto.ServiceTicketRequestDTO;
import com.erp.crm.dto.ServiceTicketResponseDTO;
import com.erp.crm.models.ServiceEntitlement;
import com.erp.crm.models.ServiceStatus;
import com.erp.crm.repositories.ServiceEntitlementRepository;
import com.erp.crm.services.ServiceTicketService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class ServiceTicketController {

    private final ServiceTicketService ticketService;
    private final ServiceEntitlementRepository entitlementRepo;

    public ServiceTicketController(ServiceTicketService ticketService, ServiceEntitlementRepository entitlementRepo) {
        this.ticketService = ticketService;
        this.entitlementRepo = entitlementRepo;
    }

    // Create New Ticket
    @PostMapping("/open")
    @PreAuthorize("hasAnyRole('ENGINEER','ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> openTicket(@RequestBody ServiceTicketRequestDTO dto) {
        return ResponseEntity.ok(ticketService.openTicket(dto));
    }

    // Approve Ticket (Admin only)
    @PatchMapping("/{ticketId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> approveTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.updateWork(ticketId, ServiceStatus.ASSIGNED));
    }

    // Engineer Updates Status
    @PatchMapping("/{ticketId}/status")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceTicketResponseDTO> updateTicketStatus(
            @PathVariable Long ticketId,
            @RequestParam ServiceStatus status) {
        return ResponseEntity.ok(ticketService.updateWork(ticketId, status));
    }

    // Close Ticket (Admin/SubAdmin)
    @PatchMapping("/{ticketId}/close")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> closeTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.closeTicket(ticketId));
    }

    // Check Free Service Availability
    @GetMapping("/sale/{saleId}/product/{productId}/free-service-available")
    public ResponseEntity<Boolean> isFreeServiceAvailable(
            @PathVariable Long saleId,
            @PathVariable Long productId) {

        boolean available = entitlementRepo
                .findBySale_SaleIdAndProduct_ProductId(saleId, productId)
                .map(ServiceEntitlement::canUseService)
                .orElse(false);

        return ResponseEntity.ok(available);
    }

    // Get All Tickets
    @GetMapping("/get-all")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<List<ServiceTicketResponseDTO>> getAllServiceTickets() {
        return ResponseEntity.ok(ticketService.getAllServiceTicket());
    }

    // Get Tickets by Current Engineer
    @GetMapping("/get-by-user")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<List<ServiceTicketResponseDTO>> getServiceTicketsByEngineer() {
        return ResponseEntity.ok(ticketService.getServiceTicketByUser());
    }

    // @PatchMapping("/{ticketId}/start")
    // @PreAuthorize("hasRole('ENGINEER')")
    // public ResponseEntity<ServiceTicketResponseDTO> startVisit(
    //         @PathVariable Long ticketId,
    //         @RequestParam Double startKm,
    //         @RequestParam("photo") MultipartFile startKmPhoto) {
    //     return ResponseEntity.ok(ticketService.startVisit(ticketId, startKm, startKmPhoto));
    // }

    // @PatchMapping("/{ticketId}/arrive")
    // @PreAuthorize("hasRole('ENGINEER')")
    // public ResponseEntity<ServiceTicketResponseDTO> markArrival(@PathVariable Long ticketId) {
    //     return ResponseEntity.ok(ticketService.markArrival(ticketId));
    // }

    // @PatchMapping("/{ticketId}/need-part")
    // @PreAuthorize("hasRole('ENGINEER')")
    // public ResponseEntity<ServiceTicketResponseDTO> markNeedPart(
    //         @PathVariable Long ticketId,
    //         @RequestParam String missingPart) {
    //     return ResponseEntity.ok(ticketService.markNeedPart(ticketId, missingPart));
    // }

    // @PatchMapping("/{ticketId}/collect-part")
    // @PreAuthorize("hasRole('ENGINEER')")
    // public ResponseEntity<ServiceTicketResponseDTO> markPartCollected(
    //         @PathVariable Long ticketId,
    //         @RequestParam Double collectedKm,
    //         @RequestParam(value = "photo", required = false) MultipartFile collectedKmPhoto) {
    //     return ResponseEntity.ok(ticketService.markPartCollected(ticketId, collectedKm, collectedKmPhoto));
    // }

    // @PatchMapping("/{ticketId}/fix")
    // @PreAuthorize("hasRole('ENGINEER')")
    // public ResponseEntity<ServiceTicketResponseDTO> markFixed(
    //         @PathVariable Long ticketId,
    //         @RequestParam Double endKm,
    //         @RequestParam("photo") MultipartFile endKmPhoto,
    //         @RequestParam String usedParts) {
    //     return ResponseEntity.ok(ticketService.markFixed(ticketId, endKm, endKmPhoto, usedParts));
    // }

    // @PatchMapping("/{ticketId}/complete")
    // @PreAuthorize("hasRole('ENGINEER')")
    // public ResponseEntity<ServiceTicketResponseDTO> completeService(@PathVariable Long ticketId) {
    //     return ResponseEntity.ok(ticketService.completeService(ticketId));
    // }

}
