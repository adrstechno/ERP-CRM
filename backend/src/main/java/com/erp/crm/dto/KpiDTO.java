package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KpiDTO {
    private String title;
    private String value;
    private String change;
    private String trend; // up | down | neutral
}
