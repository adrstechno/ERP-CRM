package com.erp.crm.services;

import com.erp.crm.dto.*;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                sale.setAdmin(userRepo.findById(dto.getAdminId()).orElseThrow());
                sale.setMarketer(userRepo.findById(dto.getMarketerId()).orElseThrow());

                if (dto.getDealerId() != null) {
                        sale.setDealer(userRepo.findById(dto.getDealerId()).orElseThrow());
                } else if (dto.getRetailCustomerId() != null) {
                        sale.setRetailCustomer(customerRepo.findById(dto.getRetailCustomerId()).orElseThrow());
                } else {
                        throw new IllegalArgumentException("Either dealerId or retailCustomerId must be provided");
                }

                sale.setSaleDate(dto.getSaleDate());
                sale.setTotalAmount(dto.getTotalAmount());

                // Sale items
                // Sale items
                List<SaleItem> items = dto.getItems().stream().map(i -> {
                        SaleItem item = new SaleItem();
                        item.setSale(sale);
                        item.setProduct(productRepo.findById(i.getProductId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Product not found with id: " + i.getProductId())));
                        item.setQuantity(i.getQuantity());
                        item.setUnitPrice(i.getPrice());
                        item.setTaxRate(i.getTaxRate() != null ? i.getTaxRate() : 0.0);
                        return item;
                }).toList();

                sale.setSaleItems(items);

                Sale saved = saleRepo.save(sale);
                return mapToDto(saved);
        }

        public SaleResponseDto getSale(Long saleId) {
                return saleRepo.findById(saleId)
                                .map(this::mapToDto)
                                .orElseThrow();
        }

        public List<SaleResponseDto> getAllSales() {
                return saleRepo.findAll().stream()
                                .map(this::mapToDto)
                                .toList();
        }

        private SaleResponseDto mapToDto(Sale sale) {
                SaleResponseDto dto = new SaleResponseDto();
                dto.setSaleId(sale.getSaleId());
                dto.setAdminName(sale.getAdmin().getName());
                dto.setMarketerName(sale.getMarketer().getName());

                if (sale.getDealer() != null) {
                        dto.setCustomerType("DEALER");
                        dto.setCustomerName(sale.getDealer().getName());
                } else if (sale.getRetailCustomer() != null) {
                        dto.setCustomerType("RETAIL");
                        dto.setCustomerName(sale.getRetailCustomer().getCustomerName());
                }

                dto.setSaleDate(sale.getSaleDate());
                dto.setTotalAmount(sale.getTotalAmount());
                dto.setSaleStatus(sale.getSaleStatus().name());

                dto.setItems(sale.getSaleItems()
                                .stream()
                                .map(i -> new SaleItemDto(
                                                i.getProduct().getProductId(),
                                                i.getProduct().getName(),
                                                i.getQuantity(),
                                                i.getUnitPrice(),
                                                i.getTaxRate()))
                                .toList());

                return dto;
        }
}
