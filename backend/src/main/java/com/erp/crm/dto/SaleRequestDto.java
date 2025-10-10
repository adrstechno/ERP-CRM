package com.erp.crm.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleRequestDTO {
    private Long approvedById;
    private Long createdById;
    private Long customerId; 
    private LocalDate saleDate;
    private Double totalAmount;
    private List<SaleItemRequestDTO> items;
}

