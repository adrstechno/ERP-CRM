package com.erp.crm.services;

import com.erp.crm.dto.ProductRequestDTO;
import com.erp.crm.dto.ProductResponseDTO;
import com.erp.crm.models.Product;
import com.erp.crm.repositories.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepo;

    public ProductService(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setWarrantyMonths(dto.getWarrantyMonths() != null ? dto.getWarrantyMonths() : 12);
        product.setStock(dto.getStock());

        Product saved = productRepo.save(product);
        return mapToDto(saved);
    }

    public ProductResponseDTO getProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return mapToDto(product);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepo.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public ProductResponseDTO updateProduct(Long productId, ProductRequestDTO dto) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setWarrantyMonths(dto.getWarrantyMonths() != null ? dto.getWarrantyMonths() : product.getWarrantyMonths());
        product.setStock(dto.getStock());

        Product updated = productRepo.save(product);
        return mapToDto(updated);
    }

    public void deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        productRepo.delete(product);
    }

    private ProductResponseDTO mapToDto(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setWarrantyMonths(product.getWarrantyMonths());
        dto.setStock(product.getStock());
        return dto;
    }
}
