package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.StockRequestDTO;
import com.erp.crm.dto.StockRequestResponseDTO;
import com.erp.crm.models.Status;
import com.erp.crm.services.StockRequestService;

@RestController
@RequestMapping("/api/stock-requests")
public class StockRequestController {

    private final StockRequestService stockRequestService;

    public StockRequestController(StockRequestService stockRequestService) {
        this.stockRequestService = stockRequestService;
    }

    @PostMapping("/create")
    public ResponseEntity<StockRequestResponseDTO> createRequest(@RequestBody StockRequestDTO dto) {
        return ResponseEntity.ok(stockRequestService.createRequest(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StockRequestResponseDTO>> getAllRequests() {
        return ResponseEntity.ok(stockRequestService.getAllRequests());
    }

    @GetMapping("/user")
    public ResponseEntity<List<StockRequestResponseDTO>> getUserRequests() {
        return ResponseEntity.ok(stockRequestService.getRequestsByUser());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StockRequestResponseDTO>> getStockRequestByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(stockRequestService.getStockRequestsByUserId(userId));
    }

    @PatchMapping("/update-status/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockRequestResponseDTO> updateStatus(
            @PathVariable Long requestId,
            @RequestParam Status status) {
        return ResponseEntity.ok(stockRequestService.updateStatus(requestId, status));
    }
}
