package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceReportRequestDTO {
    private Long ticketId;
    private String partsUsed;
    private Double additionalCharges;
    private String description;
}
