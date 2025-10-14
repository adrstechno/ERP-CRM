package com.erp.crm.controllers;

import com.erp.crm.dto.StockRequestDTO;
import com.erp.crm.dto.StockRequestResponseDTO;
import com.erp.crm.services.StockRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.erp.crm.models.Status;

import java.util.List;

@RestController
@RequestMapping("/api/stock-requests")
public class StockRequestController {

    private final StockRequestService stockRequestService;

    public StockRequestController(StockRequestService stockRequestService) {
        this.stockRequestService = stockRequestService;
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<StockRequestResponseDTO> createRequest(
            @PathVariable Long userId,
            @RequestBody StockRequestDTO dto) {
        return ResponseEntity.ok(stockRequestService.createRequest(userId, dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StockRequestResponseDTO>> getAllRequests() {
        return ResponseEntity.ok(stockRequestService.getAllRequests());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StockRequestResponseDTO>> getUserRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(stockRequestService.getRequestsByUser(userId));
    }

    @PatchMapping("/update-status/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockRequestResponseDTO> updateStatus(
            @PathVariable Long requestId,
            @RequestParam Status status) {
        return ResponseEntity.ok(stockRequestService.updateStatus(requestId, status));
    }
}
