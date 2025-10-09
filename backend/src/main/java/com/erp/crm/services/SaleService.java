package com.erp.crm.services;

import com.erp.crm.dto.*;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SaleService {

    private final SaleRepository saleRepo;
    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;
    private final InvoiceRepository invoiceRepo; // ✅ Add this
    private final ServiceEntitlementRepository serviceEntitlementRepo;

    public SaleService(SaleRepository saleRepo,
            UserRepository userRepo,
            CustomerRepository customerRepo,
            ProductRepository productRepo,
            InvoiceRepository invoiceRepo,
            ServiceEntitlementRepository serviceEntitlementRepo) {
        this.saleRepo = saleRepo;
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
        this.invoiceRepo = invoiceRepo;
        this.serviceEntitlementRepo = serviceEntitlementRepo;
    }

    // ... existing createSale() method ...

    public SaleResponseDTO updateSaleStatus(Long saleId, Status status) {
        Sale sale = saleRepo.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + saleId));

        Status oldStatus = sale.getSaleStatus();
        sale.setSaleStatus(status);
        Sale savedSale = saleRepo.save(sale);

        // ✅ Generate invoice only when status changes from PENDING to APPROVED
        if (oldStatus == Status.PENDING && status == Status.APPROVED) {
            generateInvoice(savedSale);
            createServiceEntitlements(savedSale); // ✅ Create 2 free services
        }

        return mapToDto(savedSale);
    }

    // ✅ Invoice Generation Logic
    private void generateInvoice(Sale sale) {
        // Check if invoice already exists
        if (sale.getInvoice() != null) {
            throw new RuntimeException("Invoice already exists for sale ID: " + sale.getSaleId());
        }

        Invoice invoice = new Invoice();
        invoice.setSale(sale);
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setTotalAmount(sale.getTotalAmount());
        invoice.setPaymentStatus(PaymentStatus.UNPAID);

        invoiceRepo.save(invoice);
    }

    // ✅ Generate unique invoice number
    private String generateInvoiceNumber() {
        int year = LocalDate.now().getYear();
        long count = invoiceRepo.count() + 1;
        return String.format("INV-%d-%05d", year, count);
        // Example: INV-2025-00001
    }

    // ✅ Create free service entitlements (2 free services per sale)
    private void createServiceEntitlements(Sale sale) {
        ServiceEntitlement entitlement = new ServiceEntitlement();
        entitlement.setSale(sale);
        entitlement.setEntitlementType(EntitlementType.FREE);
        entitlement.setTotalAllowed(2); // 2 free services
        entitlement.setUsedCount(0);
        entitlement.setExpiryDate(LocalDate.now().plusYears(1)); // Valid for 1 year

        serviceEntitlementRepo.save(entitlement);
    }

    public SaleResponseDTO createSale(SaleRequestDTO dto) {
        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        sale.setAdmin(findUserById(dto.getAdminId(), "ADMIN"));
        sale.setMarketer(findUserById(dto.getMarketerId(), "MARKETER"));
        sale.setTotalAmount(dto.getTotalAmount());

        // Set customer or dealer
        if (dto.getDealerId() != null) {
            sale.setDealer(findUserById(dto.getDealerId(), "DEALER"));
        } else if (dto.getCustomerId() != null) {
            sale.setCustomer(customerRepo.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId())));
        } else {
            throw new RuntimeException("Either dealerId or customerId must be provided");
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
        return saleRepo.findById(saleId)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + saleId));
    }

    public List<SaleResponseDTO> getAllSales() {
        return saleRepo.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<SaleResponseDTO> getSalesByDealer(Long dealerId) {
        User dealer = findUserById(dealerId, "Dealer");
        return saleRepo.findAllByDealer(dealer).stream()
                .map(this::mapToDto)
                .toList();
    }

    private SaleResponseDTO mapToDto(Sale sale) {
        SaleResponseDTO dto = new SaleResponseDTO();
        dto.setSaleId(sale.getSaleId());
        dto.setAdminName(sale.getAdmin().getName());
        dto.setMarketerName(sale.getMarketer().getName());

        if (sale.getDealer() != null) {
            dto.setCustomerType("DEALER");
            dto.setCustomerName(sale.getDealer().getName());
        } else if (sale.getCustomer() != null) {
            dto.setCustomerType("RETAIL");
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

    // Helper method to reduce repetitive code
    private User findUserById(Long id, String role) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(role + " not found with id: " + id));
    }
}
