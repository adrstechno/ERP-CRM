package com.erp.crm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    
}
