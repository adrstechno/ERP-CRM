package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockRequestDTO {
    private Long productId;
    private Integer quantity;
    private String notes;
}
