package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleItemDto {
    private Long productId;
    private Integer quantity;
    private Double unitPrice;
    private Double taxRate;
}
