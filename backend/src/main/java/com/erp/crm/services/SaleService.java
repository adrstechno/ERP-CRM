package com.erp.crm.services;

import com.erp.crm.dto.*;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import com.erp.crm.security.SecurityUtils;
import com.erp.crm.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepo;
    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;
    private final InvoiceRepository invoiceRepo;
    private final ServiceEntitlementRepository serviceEntitlementRepo;
    private final SecurityUtils securityUtils;

    // Update Sale Status
    public SaleResponseDTO updateSaleStatus(Long saleId, Status status) {
        Sale sale = saleRepo.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + saleId));

        Status oldStatus = sale.getSaleStatus();
        sale.setSaleStatus(status);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (status == Status.APPROVED && auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            String email = principal.getUsername();
            User admin = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            sale.setApprovedBy(admin);
        }

        Sale savedSale = saleRepo.save(sale);

        // Generate invoice only when status changes from PENDING to APPROVED
        if (oldStatus == Status.PENDING && status == Status.APPROVED) {
            generateInvoice(savedSale);
            createServiceEntitlements(savedSale);
            createServiceEntitlements(savedSale); // Create 2 free services
        }

        return mapToDto(savedSale);
    }

    private void generateInvoice(Sale sale) {
        if (sale.getInvoice() != null) return; // idempotent
        Invoice invoice = new Invoice();
        invoice.setSale(sale);
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setTotalAmount(sale.getTotalAmount());
        invoice.setPaymentStatus(PaymentStatus.UNPAID);
        invoice.setOutstandingAmount(sale.getTotalAmount());
        invoiceRepo.save(invoice);
    }

    private String generateInvoiceNumber() {
        int year = LocalDate.now().getYear();
        long count = invoiceRepo.count() + 1;
        return String.format("INV-%d-%05d", year, count);
    }

    private void createServiceEntitlements(Sale sale) {
        ServiceEntitlement entitlement = new ServiceEntitlement();
        entitlement.setSale(sale);
        entitlement.setEntitlementType(EntitlementType.FREE);
        entitlement.setTotalAllowed(2);
        entitlement.setUsedCount(0);
        entitlement.setExpiryDate(LocalDate.now().plusYears(1));
        serviceEntitlementRepo.save(entitlement);
    }

    public SaleResponseDTO createSale(SaleRequestDTO dto) {
        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            String email = principal.getUsername();
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            sale.setCreatedBy(user);
        }
        sale.setTotalAmount(dto.getTotalAmount());

        if (dto.getCustomerId() != null) {
            sale.setCustomer(customerRepo.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId())));
        } else {
            throw new RuntimeException("customerId must be provided");
        }

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            List<SaleItem> items = dto.getItems().stream().map(i -> {
                SaleItem item = new SaleItem();
                Product product = productRepo.findById(i.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found with id: " + i.getProductId()));
                item.setSale(sale);
                item.setProduct(product);
                item.setQuantity(i.getQuantity());
                Double unitPrice = i.getQuantity() * product.getPrice();
                item.setUnitPrice(unitPrice);
                return item;
            }).toList();
            sale.setSaleItems(items);
        } else {
            throw new RuntimeException("Sale Items cannot be null , Atleast select 1 product");
        }

        Sale saved = saleRepo.save(sale);
        return mapToDto(saved);
    }

    public SaleResponseDTO getSale(Long saleId) {
        return saleRepo.findById(saleId).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    public List<SaleResponseDTO> getAllSales() {
        return saleRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<SaleResponseDTO> getSalesByMarketer(Long userId) {
        User user = findUserById(userId);
        return saleRepo.findAllByCreatedByUserId(user.getUserId()).stream()
                .map(this::mapToDto)
                .toList();
    }

    // Helper DTO mapping
    private SaleResponseDTO mapToDto(Sale sale) {
        SaleResponseDTO dto = new SaleResponseDTO();
        dto.setSaleId(sale.getSaleId());
        if (sale.getApprovedBy() != null) {
            dto.setApprovedBy(sale.getApprovedBy().getName());
        }
        dto.setCreatedBy(sale.getCreatedBy().getName());

        if (sale.getCustomer() != null) {
            dto.setCustomerName(sale.getCustomer().getCustomerName());
        }

        dto.setSaleDate(sale.getSaleDate());
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setSaleStatus(sale.getSaleStatus().name());

        if (sale.getSaleItems() != null && !sale.getSaleItems().isEmpty()) {
            dto.setItems(sale.getSaleItems().stream()
                    .map(i -> new SaleItemResponseDTO(
                            i.getProduct().getProductId(),
                            i.getProduct().getName(),
                            i.getQuantity(),
                            i.getUnitPrice()))
                    .toList());
        }
        return dto;
    }

    private User findUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
