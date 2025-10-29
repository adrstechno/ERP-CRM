package com.erp.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceReportRequestDTO {
    private Long ticketId;
    private Double startKmReading;
    private Double endKmReading;
    private Boolean partsAvailable;
    private String partsUsed;
    private String partsToCollect;
    private String description;
    private Double additionalCharges;

}
