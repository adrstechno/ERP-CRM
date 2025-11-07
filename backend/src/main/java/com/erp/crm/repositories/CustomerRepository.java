package com.erp.crm.repositories;

import com.erp.crm.models.Customer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByCustomerName(String customerName);

    // Partial name search (case-insensitive)
    List<Customer> findByCustomerNameContainingIgnoreCase(String customerName);

    // Method for customer acquisition trends
    List<Customer> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    Optional<Customer> findByEmail(String email);

    // CustomerRepository.java
    @Query("""
            SELECT COUNT(DISTINCT s.customer)
            FROM Sale s
            WHERE s.createdBy.id = :marketerId
              AND s.customer IS NOT NULL
            """)
    Integer countActiveCustomersByMarketer(@Param("marketerId") Long marketerId);
}