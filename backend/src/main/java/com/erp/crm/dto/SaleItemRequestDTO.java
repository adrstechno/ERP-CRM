package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SaleItemRequestDTO {
    private Long productId; // ✅ Use ID instead of name
    private Integer quantity;

}
