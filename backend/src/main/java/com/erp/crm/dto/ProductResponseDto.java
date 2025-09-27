package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResponseDto {
    private Long productId;
    private String name;
    private String category;
    private Double price;
    private Integer warrantyMonths;
    private Integer stock;
}
