package com.erp.crm.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.SaleDto;
import com.erp.crm.models.Sale;
import com.erp.crm.services.SaleService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {
    private final SaleService saleService;
    
    @PostMapping("/create-sale")
    public ResponseEntity<Sale> createSale(@RequestBody SaleDto dto) {
        Sale entity = saleService.createSale(dto);        
        return ResponseEntity.ok(entity);
    }

    @GetMapping("/{saleId}")
    public ResponseEntity<Sale> getSale(@PathVariable Long saleId) {
        return ResponseEntity.ok(saleService.getSaleById(saleId));
    }

    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
    
    
}
