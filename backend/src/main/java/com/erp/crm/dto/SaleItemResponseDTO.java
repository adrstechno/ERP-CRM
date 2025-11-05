package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SaleItemResponseDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double unitPrice;
}
