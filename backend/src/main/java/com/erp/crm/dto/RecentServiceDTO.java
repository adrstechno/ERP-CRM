package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentServiceDTO {
    private Long id;
    private String date; // formatted for frontend (e.g. "Feb 10, 2024")
    private Double cost;
    private String description;
}
