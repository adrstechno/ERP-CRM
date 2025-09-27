package com.erp.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erp.crm.dto.SaleDto;
import com.erp.crm.dto.SaleItemDto;
import com.erp.crm.models.Customer;
import com.erp.crm.models.Product;
import com.erp.crm.models.Sale;
import com.erp.crm.models.SaleItem;
import com.erp.crm.models.SaleStatus;
import com.erp.crm.models.User;
import com.erp.crm.repositories.CustomerRepository;
import com.erp.crm.repositories.ProductRepository;
import com.erp.crm.repositories.SaleRepository;
import com.erp.crm.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaleService {
        private final UserRepository userRepository;
        private final CustomerRepository customerRepository;
        private final ProductRepository productRepository;
        private final SaleRepository saleRepository;

        public Sale createSale(SaleDto dto) {
                User dealer = userRepository.findById(dto.getDealerId())
                                .orElseThrow(() -> new RuntimeException("Dealer not found"));
                User marketer = userRepository.findById(dto.getMarketerId())
                                .orElseThrow(() -> new RuntimeException("Marketer not found"));
                Customer customer = customerRepository.findById(dto.getCustomerId())
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                Sale sale = new Sale();
                sale.setDealer(dealer);
                sale.setMarketer(marketer);
                sale.setCustomer(customer);
                sale.setSaleDate(dto.getSaleDate());
                sale.setTotalAmount(dto.getTotalAmount());
                sale.setSaleStatus(SaleStatus.PENDING);

                for (SaleItemDto itemDto : dto.getSaleItems()) {

                        Product product = productRepository.findById(itemDto.getProductId())
                                        .orElseThrow(() -> new RuntimeException("Product not found"));
                        SaleItem item = new SaleItem();
                        item.setProduct(product);
                        item.setSale(sale);
                        item.setQuantity(itemDto.getQuantity());
                        item.setUnitPrice(itemDto.getUnitPrice());
                        item.setTaxRate(itemDto.getTaxRate());
                        sale.getSaleItems().add(item);
                }

                return saleRepository.save(sale);
        }

        public Sale getSaleById(Long id) {
                return saleRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Sale not found"));
        }

        public List<Sale> getAllSales() {
                return saleRepository.findAll();
        }
}
