package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleItemDTO {
    private Long productId;   // ✅ Use ID instead of name
    private String productName; // ✅ Filled only in response
    private Integer quantity;
    private Double price;
    private Double taxRate = 0.0;
}
