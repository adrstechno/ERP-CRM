package com.erp.crm.services;

import com.erp.crm.dto.*;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class SaleService {

    private final SaleRepository saleRepo;
    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;

    public SaleService(SaleRepository saleRepo, UserRepository userRepo,
                       CustomerRepository customerRepo, ProductRepository productRepo) {
        this.saleRepo = saleRepo;
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
    }

    public SaleResponseDto createSale(SaleRequestDto dto) {
        Sale sale = new Sale();
        sale.setSaleDate(dto.getSaleDate() != null ? dto.getSaleDate() : LocalDate.now());

        // Set admin and marketer
        sale.setAdmin(findUserById(dto.getAdminId(), "Admin"));
        sale.setMarketer(findUserById(dto.getMarketerId(), "Marketer"));

        // Set customer or dealer
        if (dto.getDealerId() != null) {
            sale.setDealer(findUserById(dto.getDealerId(), "Dealer"));
        } else if (dto.getCustomerId() != null) {
            sale.setCustomer(customerRepo.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId())));
        } else {
            throw new RuntimeException("Either dealerId or customerId must be provided");
        }

        sale.setTotalAmount(dto.getTotalAmount());

        // Map sale items if any
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            List<SaleItem> items = dto.getItems().stream().map(i -> {
                SaleItem item = new SaleItem();
                item.setSale(sale);
                item.setProduct(productRepo.findById(i.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found with id: " + i.getProductId())));
                item.setQuantity(i.getQuantity());
                item.setUnitPrice(i.getPrice());
                item.setTaxRate(i.getTaxRate() != null ? i.getTaxRate() : 0.0);
                return item;
            }).toList();
            sale.setSaleItems(items);
        }

        Sale saved = saleRepo.save(sale);
        return mapToDto(saved);
    }

    public SaleResponseDto getSale(Long saleId) {
        return saleRepo.findById(saleId)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + saleId));
    }

    public List<SaleResponseDto> getAllSales() {
        return saleRepo.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<SaleResponseDto> getSalesByDealer(Long dealerId) {
        User dealer = findUserById(dealerId, "Dealer");
        return saleRepo.findAllByDealer(dealer).stream()
                .map(this::mapToDto)
                .toList();
    }

    public SaleResponseDto updateSaleStatus(Long saleId, SaleStatus status) {
        Sale sale = saleRepo.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + saleId));
        sale.setSaleStatus(status);
        return mapToDto(saleRepo.save(sale));
    }

    private SaleResponseDto mapToDto(Sale sale) {
        SaleResponseDto dto = new SaleResponseDto();
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
                    .map(i -> new SaleItemDto(
                            i.getProduct().getProductId(),
                            i.getProduct().getName(),
                            i.getQuantity(),
                            i.getUnitPrice(),
                            i.getTaxRate()))
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
