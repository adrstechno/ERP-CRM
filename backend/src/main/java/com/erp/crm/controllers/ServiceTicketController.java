package com.erp.crm.controllers;

import com.erp.crm.dto.ServiceTicketRequestDTO;
import com.erp.crm.dto.ServiceTicketResponseDTO;
import com.erp.crm.models.Status;
import com.erp.crm.models.ServiceEntitlement;
import com.erp.crm.repositories.ServiceEntitlementRepository;
import com.erp.crm.services.ServiceTicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
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

    // Engineer creates a ticket
    @PostMapping("/open")
    @PreAuthorize("hasAnyRole('ENGINEER','ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> openTicket(@RequestBody ServiceTicketRequestDTO dto) {
        return ResponseEntity.ok(ticketService.openTicket(dto));
    }

    @PatchMapping("/{ticketId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> approve(@PathVariable Long ticketId) {
        Status status = Status.APPROVED;
        return ResponseEntity.ok(ticketService.updateWork(ticketId, status));
    }

    @PatchMapping("/{ticketId}/update")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceTicketResponseDTO> updateWork(@PathVariable Long ticketId, @RequestParam Status status) {
        return ResponseEntity.ok(ticketService.updateWork(ticketId, status));
    }

    @PatchMapping("/{ticketId}/close")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> closeTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.closeTicket(ticketId));
    }

    // Check if FREE service available
    @GetMapping("/sale/{saleId}/product/{productId}/free-service-available")
    public ResponseEntity<Boolean> isFreeServiceAvailable(@PathVariable Long saleId, @PathVariable Long productId) {
        boolean available = entitlementRepo.findBySale_SaleIdAndProduct_ProductId(saleId, productId)
                .map(ServiceEntitlement::canUseService)
                .orElse(false);
        return ResponseEntity.ok(available);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ServiceTicketResponseDTO>> getAllServiceTicket() {
        return ResponseEntity.ok(ticketService.getAllServiceTicket());
    }

    @GetMapping("/get-services-by-user")
    public ResponseEntity<List<ServiceTicketResponseDTO>> getServiceTicketByUser() {
        return ResponseEntity.ok(ticketService.getServiceTicketByUser());
    }
}
