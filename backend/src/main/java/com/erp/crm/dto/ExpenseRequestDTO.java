package com.erp.crm.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.erp.crm.models.ExpenseCategory;

import lombok.Data;

@Data
public class ExpenseRequestDTO {
    private LocalDate date;
    private ExpenseCategory category;
    private BigDecimal amount;
    private String remarks;
    private String invoiceUrl; 

}
