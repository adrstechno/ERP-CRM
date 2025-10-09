package com.erp.crm.controllers;

import com.erp.crm.dto.ProductRequestDTO;
import com.erp.crm.dto.ProductResponseDTO;
import com.erp.crm.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@PreAuthorize("hasAnyRole('ADMIN','SUBADMIN','MARKETER')")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create a new product
    @PostMapping("/create")
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PostMapping("/create-bulk")
    public ResponseEntity<List<ProductResponseDTO>> createProducts(@RequestBody List<ProductRequestDTO> dtos) {
        return ResponseEntity.ok(productService.createProducts(dtos));
    }

    // Get a single product by ID
    @GetMapping("get-product/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    // Get all products
    @GetMapping("/all")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Update a product
    @PutMapping("/{id}/update")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    // Delete a product
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
