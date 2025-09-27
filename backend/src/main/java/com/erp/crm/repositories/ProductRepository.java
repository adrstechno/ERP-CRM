package com.erp.crm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
