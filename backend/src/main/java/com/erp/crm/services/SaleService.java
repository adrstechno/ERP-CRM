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

    private void updateProductStock(Sale sale) {
        if (sale.getSaleItems() == null || sale.getSaleItems().isEmpty())
            return;

        for (SaleItem item : sale.getSaleItems()) {
            // Always fetch fresh product from DB to ensure managed entity
            Product product = productRepo.findById(item.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getProductId()));

            int quantity = item.getQuantity();

            if (product.getStock() < quantity) {
                throw new RuntimeException(
                    String.format("Insufficient stock for product '%s'. Available: %d, Required: %d",
                        product.getName(),
                        product.getStock(),
                        quantity)
                );
            }

            product.setStock(product.getStock() - quantity);
            productRepo.save(product); // Explicitly save managed entity
        }
    }

    // Update Sale Status
    public SaleResponseDTO updateSaleStatus(Long saleId, Status status) {
        Sale sale = saleRepo.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + saleId));
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Status oldStatus = sale.getSaleStatus();
        
        if (status == Status.APPROVED && auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            // Only deduct stock if transitioning from PENDING to APPROVED
            // Admin-created sales already deducted stock during creation
            if (oldStatus == Status.PENDING) {
                updateProductStock(sale); // Deduct stock
            }
            
            String email = principal.getUsername();
            User admin = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            sale.setApprovedBy(admin);
        }
        
        sale.setSaleStatus(status);
        Sale savedSale = saleRepo.save(sale);

        // Generate invoice only when status changes from PENDING to APPROVED
        if (oldStatus == Status.PENDING && status == Status.APPROVED) {
            generateInvoice(savedSale);
            createServiceEntitlements(savedSale);
        }

        return mapToDto(savedSale);
    }

    private void generateInvoice(Sale sale) {
        if (sale.getInvoice() != null)
            return; // idempotent
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
        if (sale.getSaleItems() == null || sale.getSaleItems().isEmpty())
            return;

        for (SaleItem item : sale.getSaleItems()) {
            ServiceEntitlement entitlement = new ServiceEntitlement();
            entitlement.setSale(sale);
            entitlement.setProduct(item.getProduct());
            entitlement.setEntitlementType(EntitlementType.FREE);
            entitlement.setTotalAllowed(2); // 2 free services per product
            entitlement.setUsedCount(0);
            entitlement.setExpiryDate(LocalDate.now().plusYears(1));
            serviceEntitlementRepo.save(entitlement);
        }
    }

    public SaleResponseDTO createSale(SaleRequestDTO dto) {
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("Unauthorized access: user context not found");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Check if user is admin
        boolean isAdmin = user.getRole().getName().equalsIgnoreCase("ADMIN") || 
                         user.getRole().getName().equalsIgnoreCase("SUBADMIN");

        // Validate customer
        if (dto.getCustomerId() == null) {
            throw new RuntimeException("customerId must be provided");
        }

        Customer customer = customerRepo.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        // Validate items exist
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new RuntimeException("Sale Items cannot be null. At least one product must be selected.");
        }

        // VALIDATE STOCK AVAILABILITY BEFORE CREATING SALE
        for (SaleItemRequestDTO itemDto : dto.getItems()) {
            Product product = productRepo.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDto.getProductId()));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new RuntimeException(
                    String.format("Insufficient stock for product '%s'. Available: %d, Requested: %d",
                        product.getName(),
                        product.getStock(),
                        itemDto.getQuantity())
                );
            }
        }

        // Create sale entity
        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        sale.setCreatedBy(user);
        sale.setTotalAmount(dto.getTotalAmount());
        sale.setCustomer(customer);

        // Set status based on user role
        if (isAdmin) {
            sale.setSaleStatus(Status.APPROVED);
            sale.setApprovedBy(user); // Admin approves their own sale
        } else {
            sale.setSaleStatus(Status.PENDING);
        }

        // Create sale items
        List<SaleItem> items = dto.getItems().stream().map(i -> {
            SaleItem item = new SaleItem();
            Product product = productRepo.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + i.getProductId()));
            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(i.getQuantity());
            double unitPrice = i.getQuantity() * product.getPrice();
            item.setUnitPrice(unitPrice);
            return item;
        }).toList();
        
        sale.setSaleItems(items);

        // Save sale
        Sale savedSale = saleRepo.save(sale);

        // If admin created, process immediately
        if (isAdmin) {
            updateProductStock(savedSale); // Deduct stock
            generateInvoice(savedSale);     // Generate invoice
            createServiceEntitlements(savedSale); // Create entitlements
        }

        return mapToDto(savedSale);
    }

    public SaleResponseDTO getSale(Long saleId) {
        return saleRepo.findById(saleId).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    public List<SaleResponseDTO> getAllSales() {
        return saleRepo.findAllByOrderBySaleIdDesc().stream().map(this::mapToDto).collect(Collectors.toList());
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
                            i.getProduct().getPrice()))
                    .toList());
        }
        return dto;
    }

    private User findUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}