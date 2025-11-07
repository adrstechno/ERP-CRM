package com.erp.crm.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.erp.crm.models.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findAllByCreatedByUserId(Long userId);

    List<Sale> findAllByOrderBySaleIdDesc();

    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.saleDate BETWEEN :start AND :end")
    Double getTotalSales(LocalDate start, LocalDate end);

    @Query("SELECT si.product.productId, si.product.name, SUM(si.quantity), SUM(si.quantity * si.unitPrice) FROM SaleItem si JOIN si.sale s GROUP BY si.product.productId, si.product.name ORDER BY SUM(si.quantity) DESC")
    List<Object[]> getTopProducts(Pageable pageable);

    // Additional methods for marketer analytics
    List<Sale> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);

    List<Sale> findTop10ByOrderBySaleDateDesc();

    // 1. Total Sales by Marketer (YTD)
    @Query("""
            SELECT COALESCE(SUM(s.totalAmount), 0.0)
            FROM Sale s
            WHERE s.createdBy.id = :marketerId
              AND s.saleDate BETWEEN :start AND :end
            """)
    Double getTotalSalesByMarketer(@Param("marketerId") Long marketerId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    // 2. Total Payments Received by Marketer (via Invoice → Payments)
    @Query("""
            SELECT COALESCE(SUM(p.amount), 0.0)
            FROM Sale s
            JOIN s.invoice i
            JOIN i.payments p
            WHERE s.createdBy.id = :marketerId
              AND p.paymentDate BETWEEN :start AND :end
              AND p.status NOT IN ('PENDING', 'UNPAID')
            """)
    Double getTotalPaymentsByMarketer(@Param("marketerId") Long marketerId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    // 3. Count sales this month
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.createdBy.id = :marketerId AND s.saleDate BETWEEN :start AND :end")
    Integer countSalesThisMonthByMarketer(@Param("marketerId") Long marketerId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    // 4. Today's total sales
    @Query("SELECT COALESCE(SUM(s.totalAmount), 0.0) FROM Sale s WHERE s.createdBy.id = :marketerId AND s.saleDate = :date")
    Double getTodaySalesByMarketer(@Param("marketerId") Long marketerId, @Param("date") LocalDate date);

    // 5. Last sale amount (latest by saleDate + saleId)
    @Query("SELECT s.totalAmount FROM Sale s WHERE s.createdBy.id = :marketerId ORDER BY s.saleDate DESC, s.saleId DESC LIMIT 1")
    Double getLastSaleAmountByMarketer(@Param("marketerId") Long marketerId);
}
