package com.erp.crm.controllers;

import com.erp.crm.services.MarketerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marketer")
public class MarketerController {

    private final MarketerService marketerService;

    public MarketerController(MarketerService marketerService) {
        this.marketerService = marketerService;
    }

    // Get marketer dashboard statistics
    @GetMapping("/dashboard/statistics")
    @PreAuthorize("hasAnyRole('MARKETER','ADMIN','SUBADMIN')")
    public ResponseEntity<Map<String, Object>> getMarketerStatistics() {
        return ResponseEntity.ok(marketerService.getMarketerStatistics());
    }

    // Get monthly sales vs payments comparison
    @GetMapping("/dashboard/sales-vs-payments")
    @PreAuthorize("hasAnyRole('MARKETER','ADMIN','SUBADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getSalesVsPayments() {
        return ResponseEntity.ok(marketerService.getMonthlySalesVsPayments());
    }

    // Get product category performance
    @GetMapping("/dashboard/category-performance")
    @PreAuthorize("hasAnyRole('MARKETER','ADMIN','SUBADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getCategoryPerformance() {
        return ResponseEntity.ok(marketerService.getCategoryPerformance());
    }

    // Get recent sales for marketer
    @GetMapping("/dashboard/recent-sales")
    @PreAuthorize("hasAnyRole('MARKETER','ADMIN','SUBADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getRecentSales() {
        return ResponseEntity.ok(marketerService.getRecentSales());
    }

    // Get customer acquisition trends
    @GetMapping("/dashboard/customer-trends")
    @PreAuthorize("hasAnyRole('MARKETER','ADMIN','SUBADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getCustomerTrends() {
        return ResponseEntity.ok(marketerService.getCustomerAcquisitionTrends());
    }
}