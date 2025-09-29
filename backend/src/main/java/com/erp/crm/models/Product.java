package com.erp.crm.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private Double price;

    @Column(name = "warranty_months")
    private Integer warrantyMonths = 12;

    @Column(nullable = false)
    private Integer stock = 0;

    // Optional: convenience method to update stock
    public void adjustStock(int quantity) {
        if (this.stock + quantity < 0) {
            throw new RuntimeException("Insufficient stock for product: " + this.name);
        }
        this.stock += quantity;
    }
}
