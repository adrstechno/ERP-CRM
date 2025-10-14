package com.erp.crm.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleResponseDTO {
    private Long saleId;
    private String approvedBy;
        private String createdBy;
    private String customerName;
    private LocalDate saleDate;
    private Double totalAmount;
    private String saleStatus;
    private List<SaleItemResponseDTO> items;
}
