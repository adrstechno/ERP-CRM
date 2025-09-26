package com.erp.crm.repositories;

import com.erp.crm.models.Customer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
    List<Customer> findByCustomerName(String customerName);
}