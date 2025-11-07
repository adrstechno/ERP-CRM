
package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MarketerDashboardDTO{
    private Double totalSales;           // ₹1,85,000
    private Double totalPayments;       // ₹1,50,000
    private Double outstandingAmount;    // ₹35,000
    private Integer thisMonthSalesCount; // 18
    private Double conversionRate;       // 81.0
    private Double todaySales;         // ₹12,500
    private Double lastSaleAmount;       // ₹8,500
    private Integer totalActiveCustomers; // 42
}
 