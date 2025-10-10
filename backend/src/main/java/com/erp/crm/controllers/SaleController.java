package com.erp.crm.controllers;

import com.erp.crm.dto.*;
import com.erp.crm.services.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping("/create-sale")
    public ResponseEntity<SaleResponseDTO> createSale(@RequestBody SaleRequestDTO dto) {
        return ResponseEntity.ok(saleService.createSale(dto));
    }

    @GetMapping("/get-sale/{id}")
    public ResponseEntity<SaleResponseDTO> getSale(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getSale(id));
    }

    @GetMapping("/get-all-sales")
    public ResponseEntity<List<SaleResponseDTO>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }

    // Dealer-specific sales
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<SaleResponseDTO>> getSalesByDealer(@PathVariable Long dealerId) {
        return ResponseEntity.ok(saleService.getSalesByDealer(dealerId));
    }

    // Dealer-specific sales
    @GetMapping("/marketer/{marketerId}")
    public ResponseEntity<List<SaleResponseDTO>> getSalesByMarketer(@PathVariable Long marketerId) {
        return ResponseEntity.ok(saleService.getSalesByMarketer(marketerId));
    }

    // Global update sale status
    @PatchMapping("/{saleId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN')")
    public ResponseEntity<SaleResponseDTO> updateSaleStatus(
            @PathVariable Long saleId,
            @RequestBody SaleStatusDTO statusDto) {
        return ResponseEntity.ok(saleService.updateSaleStatus(saleId, statusDto.getSaleStatus()));
    }
}
