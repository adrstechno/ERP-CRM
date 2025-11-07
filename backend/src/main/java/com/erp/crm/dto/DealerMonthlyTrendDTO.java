package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DealerMonthlyTrendDTO {
    private String month;
    private Long requested;
    private Long approved;
    private Long pending;
}