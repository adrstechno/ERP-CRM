package com.erp.crm.controllers;

import com.erp.crm.dto.ServiceTicketRequestDTO;
import com.erp.crm.dto.ServiceTicketResponseDTO;
import com.erp.crm.models.ServiceEntitlement;
import com.erp.crm.models.Status;
import com.erp.crm.repositories.ServiceEntitlementRepository;
import com.erp.crm.services.ServiceTicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class ServiceTicketController {

    private final ServiceTicketService ticketService;
    private final ServiceEntitlementRepository entitlementRepo;

    public ServiceTicketController(ServiceTicketService ticketService , ServiceEntitlementRepository  entitlementRepo ) {
        this.ticketService = ticketService;
        this.entitlementRepo = entitlementRepo;
    }

    // 1️⃣ Engineer creates ticket → OPEN
    @PostMapping("/open")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceTicketResponseDTO> openTicket(@RequestBody ServiceTicketRequestDTO dto) {
        return ResponseEntity.ok(ticketService.openTicket(dto));
    }

    // 2️⃣ Admin/Subadmin approves → APPROVED (FREE/PAID check)
    @PatchMapping("/{ticketId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> approveTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.approveTicket(ticketId));
    }

    // 3️⃣ Engineer starts work → IN_PROGRESS
    @PatchMapping("/{ticketId}/start")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceTicketResponseDTO> startWork(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.startWork(ticketId));
    }

    // 4️⃣ Engineer completes work → COMPLETED
    @PatchMapping("/{ticketId}/completed")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<ServiceTicketResponseDTO> completeWork(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.completeWork(ticketId));
    }

    // 5️⃣ Admin/Subadmin closes ticket → CLOSED
    @PatchMapping("/{ticketId}/close")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<ServiceTicketResponseDTO> closeTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.closeTicket(ticketId));
    }

    @GetMapping("/sale/{saleId}/free-service-available")
    public ResponseEntity<Boolean> isFreeServiceAvailable(@PathVariable Long saleId) {
        ServiceEntitlement entitlement = entitlementRepo.findBySale_SaleId(saleId)
                .orElseThrow(() -> new RuntimeException("No entitlement found for this sale"));

        boolean available = entitlement.canUseService();
        return ResponseEntity.ok(available);
    }

}
