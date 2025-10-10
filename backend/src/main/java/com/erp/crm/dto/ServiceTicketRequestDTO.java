package com.erp.crm.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.erp.crm.models.EntitlementType;
import com.erp.crm.models.Priority;

@Getter
@Setter
public class ServiceTicketRequestDTO {
    
    @NotNull
    private Long saleId;

    @NotNull
    private Long customerId;

    @NotNull
    private Long productId;

    @NotNull
    private Long assignedEngineerId;

    @NotNull
    private Priority priority;   // LOW, MEDIUM, HIGH

    @NotNull
    private LocalDate dueDate;
}
