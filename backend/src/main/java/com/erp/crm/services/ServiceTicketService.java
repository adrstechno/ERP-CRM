package com.erp.crm.services;

import com.erp.crm.dto.ServiceTicketRequestDTO;
import com.erp.crm.dto.ServiceTicketResponseDTO;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ServiceTicketService {

    private final ServiceTicketRepository ticketRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;
    private final SaleRepository saleRepo;
    private final ServiceEntitlementRepository entitlementRepo;

    public ServiceTicketService(ServiceTicketRepository ticketRepo,
                               ProductRepository productRepo,
                               UserRepository userRepo,
                               CustomerRepository customerRepo,
                               SaleRepository saleRepo,
                               ServiceEntitlementRepository entitlementRepo) {
        this.ticketRepo = ticketRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.saleRepo = saleRepo;
        this.entitlementRepo = entitlementRepo;
    }

    // 1️⃣ Engineer opens ticket → OPEN
    public ServiceTicketResponseDTO openTicket(ServiceTicketRequestDTO dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User engineer = userRepo.findById(dto.getAssignedEngineerId())
                .orElseThrow(() -> new RuntimeException("Engineer not found"));

        Customer customer = customerRepo.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Sale sale = dto.getSaleId() != null
                ? saleRepo.findById(dto.getSaleId())
                        .orElseThrow(() -> new RuntimeException("Sale not found"))
                : customer.getSales().stream()
                        .filter(s -> s.getSaleItems().stream()
                                .anyMatch(si -> si.getProduct().getProductId().equals(product.getProductId())))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("No sale found for this product"));

        List<ServiceEntitlement> entitlements = entitlementRepo.findAllBySale_SaleId(sale.getSaleId());

        ServiceEntitlement entitlementToUse;
        EntitlementType typeToUse;

        ServiceEntitlement freeEntitlement = entitlements.stream()
                .filter(e -> e.getEntitlementType() == EntitlementType.FREE)
                .findFirst()
                .orElse(null);

        if (freeEntitlement != null && freeEntitlement.canUseService()) {
            freeEntitlement.useService();
            entitlementRepo.save(freeEntitlement);
            entitlementToUse = freeEntitlement;
            typeToUse = EntitlementType.FREE;
        } else {
            ServiceEntitlement paidEntitlement = entitlements.stream()
                    .filter(e -> e.getEntitlementType() == EntitlementType.PAID)
                    .findFirst()
                    .orElseGet(() -> {
                        ServiceEntitlement newPaid = new ServiceEntitlement();
                        newPaid.setSale(sale);
                        newPaid.setEntitlementType(EntitlementType.PAID);
                        newPaid.setUsedCount(0);
                        newPaid.setTotalAllowed(Integer.MAX_VALUE);
                        newPaid.setExpiryDate(sale.getSaleDate().plusYears(1));
                        return entitlementRepo.save(newPaid);
                    });
            entitlementToUse = paidEntitlement;
            typeToUse = EntitlementType.PAID;
        }

        ServiceTicket ticket = new ServiceTicket();
        ticket.setCustomer(customer);
        ticket.setProduct(product);
        ticket.setAssignedEngineer(engineer);
        ticket.setSale(sale);
        ticket.setPriority(dto.getPriority());
        ticket.setStatus(Status.OPEN);
        ticket.setDueDate(dto.getDueDate());
        ticket.setServiceEntitlement(entitlementToUse);
        ticket.setEntitlementType(typeToUse);

        return mapToDto(ticketRepo.save(ticket));
    }

    // 2️⃣ Approve ticket → APPROVED
    public ServiceTicketResponseDTO approveTicket(Long ticketId) {
        ServiceTicket ticket = getTicket(ticketId);

        if (ticket.getStatus() != Status.OPEN)
            throw new RuntimeException("Only OPEN tickets can be approved");

        ticket.setStatus(Status.APPROVED);
        return mapToDto(ticketRepo.save(ticket));
    }

    // 3️⃣ Engineer starts work → IN_PROGRESS
    public ServiceTicketResponseDTO startWork(Long ticketId) {
        ServiceTicket ticket = getTicket(ticketId);

        if (ticket.getStatus() != Status.APPROVED)
            throw new RuntimeException("Only APPROVED tickets can be started");

        ticket.setStatus(Status.IN_PROGRESS);
        return mapToDto(ticketRepo.save(ticket));
    }

    // 4️⃣ Engineer completes work → COMPLETED
    public ServiceTicketResponseDTO completeWork(Long ticketId) {
        ServiceTicket ticket = getTicket(ticketId);

        if (ticket.getStatus() != Status.IN_PROGRESS)
            throw new RuntimeException("Only IN_PROGRESS tickets can be completed");

        ticket.setStatus(Status.COMPLETED);
        return mapToDto(ticketRepo.save(ticket));
    }

    // 5️⃣ Admin closes ticket → CLOSED
    public ServiceTicketResponseDTO closeTicket(Long ticketId) {
        ServiceTicket ticket = getTicket(ticketId);

        if (ticket.getStatus() != Status.COMPLETED)
            throw new RuntimeException("Only COMPLETED tickets can be closed");

        ticket.setStatus(Status.CLOSED);
        return mapToDto(ticketRepo.save(ticket));
    }

    private ServiceTicket getTicket(Long id) {
        return ticketRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    private ServiceTicketResponseDTO mapToDto(ServiceTicket ticket) {
        ServiceTicketResponseDTO dto = new ServiceTicketResponseDTO();
        dto.setTicketId(ticket.getId());
        dto.setCustomerName(ticket.getCustomer().getCustomerName());
        dto.setProductName(ticket.getProduct().getName());
        dto.setAssignedEngineerName(ticket.getAssignedEngineer().getName());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        dto.setDueDate(ticket.getDueDate());
        dto.setEntitlementType(ticket.getEntitlementType());
        dto.setSaleId(ticket.getSale().getSaleId());
        dto.setServiceEntitlementId(ticket.getServiceEntitlement() != null ? ticket.getServiceEntitlement().getServiceEntitlementId() : null);
        return dto;
    }
}
