package com.erp.crm.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DealerDashboardDTO {
    private Long stockApproved;
    private Long stockRequested;
    private Long stockRejected;
    private Long totalRequests;
    List<DealerMonthlyTrendDTO> monthlyTrends;
}