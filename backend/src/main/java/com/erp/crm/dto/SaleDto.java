package com.erp.crm.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleDto {
    private Long dealerLongId;
    private Long customerId;
    private Long marketerId;
    private LocalDate saleDate;
    private Double totalAmount;
    private List<SaleItemDto> saleItems;

}

