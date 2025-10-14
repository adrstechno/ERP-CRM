package com.erp.crm.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.erp.crm.models.Status;

import java.sql.Timestamp;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpenseResponseDTO {
    private Long ExpenseId;
    private String userName; 
    private LocalDate expenseDate;
    private com.erp.crm.models.ExpenseCategory category;
    private BigDecimal amount;
    private String remarks;
    private Status status;
    private String invoiceUrl;
    private String approvedBy; 
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
