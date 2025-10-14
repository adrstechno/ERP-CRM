package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.erp.crm.models.EntitlementType;
import com.erp.crm.models.Priority;
import com.erp.crm.models.ServiceTicket;
import com.erp.crm.models.Status;

@Getter
@Setter
public class ServiceTicketResponseDTO {
    private Long ticketId;
    private String customerName;
    private Long customerId;
    private String productName;
    private String assignedEngineerName;
    private Priority priority;
    private Status status;
    private LocalDate dueDate;
    private EntitlementType entitlementType;
    private Long saleId;
    private Long serviceEntitlementId;


    public static ServiceTicketResponseDTO fromEntity(ServiceTicket ticket) {
        ServiceTicketResponseDTO dto = new ServiceTicketResponseDTO();
        dto.setTicketId(ticket.getId());
        dto.setCustomerName(ticket.getCustomer().getCustomerName());
        dto.setCustomerId(ticket.getCustomer().getCustomerId());
        dto.setProductName(ticket.getProduct().getName());
        dto.setAssignedEngineerName(ticket.getAssignedEngineer().getName());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        dto.setDueDate(ticket.getDueDate());
        dto.setEntitlementType(ticket.getEntitlementType());
        
        if (ticket.getSale() != null) {
            dto.setSaleId(ticket.getSale().getSaleId());
        }
        if (ticket.getServiceEntitlement() != null) {
            dto.setServiceEntitlementId(ticket.getServiceEntitlement().getServiceEntitlementId());
        }
        
        return dto;
    }
}

