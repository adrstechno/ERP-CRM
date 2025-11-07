package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EngineerDashboardDTO {
    private List<KpiDTO> kpis;
    private ServiceBreakdownDTO serviceBreakdown;
    private List<RecentServiceDTO> recentServices;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ServiceBreakdownDTO {
        private Long total;
        private List<CategoryStatDTO> data;
    }
}
