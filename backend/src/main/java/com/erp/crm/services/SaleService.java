package com.erp.crm.services;

import com.erp.crm.dto.*;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SaleService {

    private final SaleRepository saleRepo;
    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;
    private final InvoiceRepository invoiceRepo;
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

    // Create Sale
    public SaleResponseDTO createSale(SaleRequestDTO dto) {
        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        sale.setAdmin(findUserById(dto.getAdminId(), "ADMIN"));
        sale.setMarketer(findUserById(dto.getMarketerId(), "MARKETER"));
        sale.setTotalAmount(dto.getTotalAmount());

        if (dto.getDealerId() != null) {
            sale.setDealer(findUserById(dto.getDealerId(), "DEALER"));
        } else if (dto.getCustomerId() != null) {
            sale.setCustomer(customerRepo.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found")));
        } else {
            throw new RuntimeException("Either dealerId or customerId must be provided");
        }

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            List<SaleItem> items = dto.getItems().stream().map(i -> {
                SaleItem item = new SaleItem();
                Product product = productRepo.findById(i.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                item.setSale(sale);
                item.setProduct(product);
                item.setQuantity(i.getQuantity());
                item.setUnitPrice(i.getQuantity() * product.getPrice());
                return item;
            }).toList();
            sale.setSaleItems(items);
        } else {
            throw new RuntimeException("Sale Items cannot be null, select at least 1 product");
        }

        Sale saved = saleRepo.save(sale);
        return mapToDto(saved);
    }

    // Update Sale Status
    public SaleResponseDTO updateSaleStatus(Long saleId, Status status) {
        Sale sale = saleRepo.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + saleId));

        Status oldStatus = sale.getSaleStatus();
        sale.setSaleStatus(status);
        Sale savedSale = saleRepo.save(sale);

        if (oldStatus == Status.PENDING && status == Status.APPROVED) {
            generateInvoice(savedSale);
            createServiceEntitlements(savedSale);
        }

        return mapToDto(savedSale);
    }

    // Generate Invoice
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

    // Getters
    public SaleResponseDTO getSale(Long saleId) {
        return saleRepo.findById(saleId).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    public List<SaleResponseDTO> getAllSales() {
        return saleRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<SaleResponseDTO> getSalesByDealer(Long dealerId) {
        User dealer = findUserById(dealerId, "DEALER");
        return saleRepo.findAllByDealer(dealer).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Helper DTO mapping
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

    private User findUserById(Long id, String role) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(role + " not found with id: " + id));
    }
}
