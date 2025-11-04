package com.erp.crm.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.erp.crm.models.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findAllByCreatedByUserId(Long userId);
    List<Sale> findAllByOrderBySaleDateDesc();

    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.saleDate BETWEEN :start AND :end")
    Double getTotalSales(LocalDate start, LocalDate end);



    @Query("SELECT si.product.productId, si.product.name, SUM(si.quantity), SUM(si.quantity * si.unitPrice) FROM SaleItem si JOIN si.sale s GROUP BY si.product.productId, si.product.name ORDER BY SUM(si.quantity) DESC")
    List<Object[]> getTopProducts(Pageable pageable);
    
    // Additional methods for marketer analytics
    List<Sale> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);
    List<Sale> findTop10ByOrderBySaleDateDesc();
}
