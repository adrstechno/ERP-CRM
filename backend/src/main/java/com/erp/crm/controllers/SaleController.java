package com.erp.crm.controllers;

import com.erp.crm.dto.*;
import com.erp.crm.services.SaleService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SaleResponseDto> createSale(@RequestBody SaleRequestDto dto) {
        return ResponseEntity.ok(saleService.createSale(dto));
    }

    @GetMapping("/get-sale/{id}")
    public ResponseEntity<SaleResponseDto> getSale(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getSale(id));
    }

    @GetMapping("/get-all-sales")
    public ResponseEntity<List<SaleResponseDto>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }

    // Dealer-specific sales
    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<SaleResponseDto>> getSalesByDealer(@PathVariable Long dealerId) {
        return ResponseEntity.ok(saleService.getSalesByDealer(dealerId));
    }

    // Global update sale status
    @PatchMapping("/{saleId}/status")
    public ResponseEntity<SaleResponseDto> updateSaleStatus(
            @PathVariable Long saleId,
            @RequestBody SaleStatusDto statusDto) {
        return ResponseEntity.ok(saleService.updateSaleStatus(saleId, statusDto.getStatus()));
    }
}
