package com.erp.crm.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleRequestDto {
    private Long adminId;
    private Long marketerId;
    private Long dealerId;         // optional
    private Long customerId; // optional
    private LocalDate saleDate;
    private Double totalAmount;
    private List<SaleItemDto> items;
}

