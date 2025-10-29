package com.erp.crm.controllers;

import com.erp.crm.dto.ServiceReportRequestDTO;
import com.erp.crm.dto.ServiceReportResponseDTO;
import com.erp.crm.config.ApiResponse;
import com.erp.crm.services.ServiceReportService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ServiceReportController {

    private final ServiceReportService reportService;

    // Create report
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ServiceReportResponseDTO>> createReport(
            @ModelAttribute ServiceReportRequestDTO dto,
            @RequestParam(value = "receipt", required = false) MultipartFile receipt) {

        ServiceReportResponseDTO response = reportService.createReport(dto, receipt);
        return ResponseEntity.ok(new ApiResponse<>(true, "Service report submitted", response));
    }

    // Get all reports (admin)
    @GetMapping("/get-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ServiceReportResponseDTO>>> getAllReports() {
        List<ServiceReportResponseDTO> list = reportService.getAllReports();
        return ResponseEntity.ok(new ApiResponse<>(true, "All reports", list));
    }

    // Get reports of current engineer
    @GetMapping("/engineer")
    public ResponseEntity<ApiResponse<List<ServiceReportResponseDTO>>> getMyReports() {
        List<ServiceReportResponseDTO> list = reportService.getReportsByEngineer();
        return ResponseEntity.ok(new ApiResponse<>(true, "My reports", list));
    }

    // Get report by ticket
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<ApiResponse<ServiceReportResponseDTO>> getReportByTicket(@PathVariable Long ticketId) {
        ServiceReportResponseDTO dto = reportService.getReportByTicket(ticketId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Report found", dto));
    }
}
