package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import com.erp.crm.models.EntitlementType;

@Getter
@Setter
public class ServiceEntitlementResponseDTO {
    private Long entitlementId;
    private String customerName;
    private EntitlementType entitlementType;
    private Integer totalAllowed;
    private Integer usedCount;
    private LocalDate expiryDate;
}
