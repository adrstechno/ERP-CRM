package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.erp.crm.models.EntitlementType;
import com.erp.crm.models.Priority;
import com.erp.crm.models.Status;

@Getter
@Setter
public class ServiceTicketResponseDTO {
    private Long ticketId;
    private String customerName;
    private String productName;
    private String assignedEngineerName;
    private Priority priority;
    private Status status;
    private LocalDate dueDate;
    private EntitlementType entitlementType;
    private Long saleId;
    private Long serviceEntitlementId;
}
