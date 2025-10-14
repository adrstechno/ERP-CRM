package com.erp.crm.controllers;

import com.erp.crm.dto.ServiceEntitlementResponseDTO;
import com.erp.crm.services.ServiceEntitlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entitlements")
public class ServiceEntitlementController {

    private final ServiceEntitlementService entitlementService;

    public ServiceEntitlementController(ServiceEntitlementService entitlementService) {
        this.entitlementService = entitlementService;
    }

    //  Get entitlements by Sale
    @GetMapping("/sale/{saleId}")
    public ResponseEntity<List<ServiceEntitlementResponseDTO>> getEntitlementsBySale(@PathVariable Long saleId) {
        List<ServiceEntitlementResponseDTO> entitlements = entitlementService.getEntitlementsBySale(saleId);
        return ResponseEntity.ok(entitlements);
    }

    @PatchMapping("/{entitlementId}/expiry-date")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')") // optional role check
    public ResponseEntity<ServiceEntitlementResponseDTO> updateExpiryDate(
            @PathVariable Long entitlementId,
            @RequestParam String newExpiryDate // format: yyyy-MM-dd
    ) {
        ServiceEntitlementResponseDTO updatedEntitlement = 
                entitlementService.updateExpiryDate(entitlementId, newExpiryDate);
        return ResponseEntity.ok(updatedEntitlement);
    }
}
