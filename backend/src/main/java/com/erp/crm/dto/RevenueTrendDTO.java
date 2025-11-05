package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevenueTrendDTO {
    private String period; // e.g., "2025-10-10" or "Oct-2025"
    private Double revenue;
}
