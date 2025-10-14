package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class StockRequestResponseDTO {
    private Long requestId;
    private Long productId;
    private String productName;
    private Integer quantity;
    private String status;
    private String requestedBy;
    private LocalDateTime requestDate;
    private String notes;
}
