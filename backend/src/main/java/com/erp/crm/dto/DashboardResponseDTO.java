package com.erp.crm.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardResponseDTO {
    private Double totalSales;
    private Double totalPayments;
    private Double outstandingPayments;
    private Double totalExpenses;
    private List<ProductStatsDTO> topProducts;
    private List<CategorySalesDTO> salesByCategory;
    private List<RevenueTrendDTO> revenueTrends;
    private List<UserStatsDTO> userStats;
}
