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

    public static ServiceEntitlementResponseDTO fromEntity(com.erp.crm.models.ServiceEntitlement entitlement) {
        ServiceEntitlementResponseDTO dto = new ServiceEntitlementResponseDTO();
        dto.setEntitlementId(entitlement.getServiceEntitlementId());
        dto.setEntitlementType(entitlement.getEntitlementType());
        dto.setTotalAllowed(entitlement.getTotalAllowed());
        dto.setUsedCount(entitlement.getUsedCount());
        dto.setExpiryDate(entitlement.getExpiryDate());

        // Customer name (fetched through sale)
        if (entitlement.getSale() != null && entitlement.getSale().getCustomer() != null) {
            dto.setCustomerName(entitlement.getSale().getCustomer().getCustomerName());
        }

        return dto;
    }

}
