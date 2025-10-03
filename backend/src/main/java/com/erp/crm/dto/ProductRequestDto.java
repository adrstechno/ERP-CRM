package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestDTO {
    private String name;
    private String category;
    private Double price;
    private Integer warrantyMonths; // optional, default 12
    private Integer stock;
}
