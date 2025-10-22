package com.erp.crm.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductStatsDTO {
    private Long productId;
    private String productName;
    private Long quantitySold;
    private Double revenue;
}
