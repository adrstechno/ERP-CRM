package com.erp.crm.services;

import com.erp.crm.dto.ServiceTicketRequestDTO;
import com.erp.crm.dto.ServiceTicketResponseDTO;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import com.erp.crm.security.UserPrincipal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

    // Engineer creates ticket
    public ServiceTicketResponseDTO openTicket(ServiceTicketRequestDTO dto) {
        Customer customer = customerRepo.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User engineer = userRepo.findById(dto.getAssignedEngineerId())
                .orElseThrow(() -> new RuntimeException("Engineer not found"));
        Sale sale = saleRepo.findById(dto.getSaleId())
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        List<Status> activeStatuses = List.of(Status.OPEN, Status.IN_PROGRESS, Status.APPROVED, Status.COMPLETED);

        boolean activeTicketExists = ticketRepo.existsBySale_SaleIdAndProduct_ProductIdAndStatusIn(
                sale.getSaleId(), product.getProductId(), activeStatuses);

        if (activeTicketExists) {
            throw new RuntimeException("A ticket for this product in this sale is already active.");
        }

        // Find entitlement for that sale + product
        ServiceEntitlement entitlement = entitlementRepo
                .findBySale_SaleIdAndProduct_ProductId(dto.getSaleId(), dto.getProductId())
                .orElseThrow(() -> new RuntimeException("No entitlement found for this product in sale"));

        EntitlementType entitlementType = entitlement.canUseService() ? EntitlementType.FREE : EntitlementType.PAID;

        ServiceTicket ticket = new ServiceTicket();
        ticket.setCustomer(customer);
        ticket.setProduct(product);
        ticket.setAssignedEngineer(engineer);
        ticket.setSale(sale);
        ticket.setServiceEntitlement(entitlement);
        ticket.setEntitlementType(entitlementType);
        ticket.setStatus(Status.OPEN);
        ticket.setPriority(dto.getPriority());
        ticket.setDueDate(dto.getDueDate());

        ticketRepo.save(ticket);
        return ServiceTicketResponseDTO.fromEntity(ticket);
    }

    // Engineer/Admin updates ticket status
    public ServiceTicketResponseDTO updateWork(Long ticketId, Status status) {
        ServiceTicket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticketRepo.save(ticket);
        return ServiceTicketResponseDTO.fromEntity(ticket);
    }

    // Close ticket → use FREE service if available
    public ServiceTicketResponseDTO closeTicket(Long ticketId) {
        ServiceTicket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ServiceEntitlement entitlement = ticket.getServiceEntitlement();

        // When closing, use FREE entitlement if available
        if (entitlement != null) {
            if (entitlement.canUseService()) {
                entitlement.useService(); // consume one free service
                ticket.setEntitlementType(EntitlementType.FREE);
            } else {
                ticket.setEntitlementType(EntitlementType.PAID);
            }
            entitlementRepo.save(entitlement);
        }

        ticket.setStatus(Status.CLOSED);
        ticketRepo.save(ticket);

        return ServiceTicketResponseDTO.fromEntity(ticket);
    }

    // Get all tickets
    public List<ServiceTicketResponseDTO> getAllServiceTicket() {
        return ticketRepo.findAll().stream()
                .map(ServiceTicketResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ServiceTicketResponseDTO> getServiceTicketByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return ticketRepo.findByAssignedEngineer(user).stream()
                .map(ServiceTicketResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
