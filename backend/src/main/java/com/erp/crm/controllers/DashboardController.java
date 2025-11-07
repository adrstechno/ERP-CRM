package com.erp.crm.controllers;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.config.ApiResponse;
import com.erp.crm.dto.AdminDashboardResponseDTO;
import com.erp.crm.dto.MarketerDashboardDTO;
import com.erp.crm.services.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<AdminDashboardResponseDTO>> getAdminDashboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "5") int topProducts) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        AdminDashboardResponseDTO dto = dashboardService.getDashboard(start, end, topProducts);
        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard data fetched", dto));
    }

    @GetMapping("/marketer")
    public ResponseEntity<ApiResponse<MarketerDashboardDTO>> getMarketerDashboard() {
        MarketerDashboardDTO data = dashboardService.getMarketerDashboardSummary();
        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard Summary", data));
    }

}
