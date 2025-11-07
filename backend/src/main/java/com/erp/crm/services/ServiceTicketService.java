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
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
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
    private final FileUploadService fileUploadService;

    public ServiceTicketService(ServiceTicketRepository ticketRepo,
                                ProductRepository productRepo,
                                UserRepository userRepo,
                                CustomerRepository customerRepo,
                                SaleRepository saleRepo,
                                ServiceEntitlementRepository entitlementRepo,
                                FileUploadService fileUploadService) {
        this.ticketRepo = ticketRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.saleRepo = saleRepo;
        this.entitlementRepo = entitlementRepo;
        this.fileUploadService = fileUploadService;
    }

    // --------------------------- Core Ticket Operations --------------------------- //

    /** Create New Service Ticket (Engineer or Admin Initiated) */
    public ServiceTicketResponseDTO openTicket(ServiceTicketRequestDTO dto) {
        Customer customer = getCustomer(dto.getCustomerId());
        Product product = getProduct(dto.getProductId());
        User engineer = getEngineer(dto.getAssignedEngineerId());
        Sale sale = getSale(dto.getSaleId());

        validateNoActiveTicket(sale, product);

        ServiceEntitlement entitlement = entitlementRepo
                .findBySale_SaleIdAndProduct_ProductId(dto.getSaleId(), dto.getProductId())
                .orElseThrow(() -> new RuntimeException("No service entitlement found for this product"));

        EntitlementType entitlementType = entitlement.canUseService() ? EntitlementType.FREE : EntitlementType.PAID;

        ServiceTicket ticket = new ServiceTicket();
        ticket.setCustomer(customer);
        ticket.setProduct(product);
        ticket.setAssignedEngineer(engineer);
        ticket.setSale(sale);
        ticket.setServiceEntitlement(entitlement);
        ticket.setEntitlementType(entitlementType);
        ticket.setServiceStatus(ServiceStatus.OPEN);
        ticket.setPriority(dto.getPriority());
        ticket.setDueDate(dto.getDueDate());
        ticket.setCreatedAt(LocalDate.now());
        ticketRepo.save(ticket);

        return ServiceTicketResponseDTO.fromEntity(ticket);
    }

    /** Update Ticket Workflow Status (used by Admin/SubAdmin) */
    public ServiceTicketResponseDTO updateWork(Long ticketId, ServiceStatus nextStatus) {
        ServiceTicket ticket = getTicket(ticketId);
        validateTransition(ticket.getServiceStatus(), nextStatus);
        ticket.setServiceStatus(nextStatus);
        ticketRepo.save(ticket);
        return ServiceTicketResponseDTO.fromEntity(ticket);
    }

    /** Close Ticket (Admin/SubAdmin) */
    public ServiceTicketResponseDTO closeTicket(Long ticketId) {
        ServiceTicket ticket = getTicket(ticketId);
        ServiceEntitlement entitlement = ticket.getServiceEntitlement();

        if (entitlement != null) {
            if (entitlement.canUseService()) {
                entitlement.useService();
                ticket.setEntitlementType(EntitlementType.FREE);
            } else {
                ticket.setEntitlementType(EntitlementType.PAID);
            }
            entitlementRepo.save(entitlement);
        }

        ticket.setServiceStatus(ServiceStatus.CLOSED);
        ticketRepo.save(ticket);
        return ServiceTicketResponseDTO.fromEntity(ticket);
    }

    // --------------------------- Query Operations --------------------------- //

    /** Get all service tickets (Admin/SubAdmin) */
    public List<ServiceTicketResponseDTO> getAllServiceTicket() {
        return ticketRepo.findAllByOrderByIdDesc()
                .stream()
                .map(ServiceTicketResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /** Get tickets assigned to currently logged-in engineer */
    public List<ServiceTicketResponseDTO> getServiceTicketByUser() {
        User engineer = getCurrentUser();
        return ticketRepo.findByAssignedEngineerOrderByIdDesc(engineer)
                .stream()
                .map(ServiceTicketResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // --------------------------- Utility Methods --------------------------- //

    private Customer getCustomer(Long id) {
        return customerRepo.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    private Product getProduct(Long id) {
        return productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    private User getEngineer(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new RuntimeException("Engineer not found"));
    }

    private Sale getSale(Long id) {
        return saleRepo.findById(id).orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    private ServiceTicket getTicket(Long id) {
        return ticketRepo.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    private void validateNoActiveTicket(Sale sale, Product product) {
        List<ServiceStatus> activeStatuses = List.of(
                ServiceStatus.OPEN, ServiceStatus.ASSIGNED, ServiceStatus.EN_ROUTE,
                ServiceStatus.ON_SITE, ServiceStatus.FIXED, ServiceStatus.IN_PROGRESS);
        boolean exists = ticketRepo.existsBySale_SaleIdAndProduct_ProductIdAndServiceStatusIn(
                sale.getSaleId(), product.getProductId(), activeStatuses);
        if (exists)
            throw new RuntimeException("Active ticket already exists for this product.");
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal))
            throw new RuntimeException("User not authenticated");

        return userRepo.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void validateTransition(ServiceStatus current, ServiceStatus next) {
        switch (current) {
            case OPEN -> allowOnly(next, ServiceStatus.ASSIGNED);
            case ASSIGNED -> allowOnly(next, ServiceStatus.EN_ROUTE, ServiceStatus.CANCELLED);
            case EN_ROUTE -> allowOnly(next, ServiceStatus.ON_SITE);
            case ON_SITE -> allowOnly(next, ServiceStatus.NEED_PART, ServiceStatus.FIXED);
            case NEED_PART -> allowOnly(next, ServiceStatus.PART_COLLECTED);
            case PART_COLLECTED -> allowOnly(next, ServiceStatus.FIXED);
            case FIXED -> allowOnly(next, ServiceStatus.COMPLETED);
            case COMPLETED, CANCELLED, CLOSED ->
                    throw new IllegalStateException("Cannot modify a completed or closed ticket");
        }
    }

    private void allowOnly(ServiceStatus next, ServiceStatus... allowed) {
        for (ServiceStatus s : allowed) {
            if (s == next)
                return;
        }
        throw new IllegalStateException("Invalid transition to: " + next);
    }
}
