package com.erp.crm.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);

}
