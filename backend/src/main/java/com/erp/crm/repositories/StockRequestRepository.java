package com.erp.crm.repositories;

import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.erp.crm.models.Status;
import com.erp.crm.models.StockRequest;
import java.util.List;

public interface StockRequestRepository extends JpaRepository<StockRequest, Long> {
    List<StockRequest> findByRequestedBy_UserId(Long userId);

    List<StockRequest> findByStatus(Status status);

    @Query("""
            SELECT COUNT(s)
            FROM StockRequest s
            WHERE s.requestedBy.userId = :dealerId
              AND s.status = 'APPROVED'
            """)
    Long countApprovedStockByDealer(Long dealerId);

    @Query("""
            SELECT COUNT(s)
            FROM StockRequest s
            WHERE s.requestedBy.userId = :dealerId
              AND s.status = 'PENDING'
            """)
    Long countPendingStockByDealer(Long dealerId);

    @Query("""
            SELECT COUNT(s)
            FROM StockRequest s
            WHERE s.requestedBy.userId = :dealerId
              AND s.status = 'REJECTED'
            """)
    Long countRejectedStockByDealer(Long dealerId);

    @Query("""
            SELECT COUNT(s)
            FROM StockRequest s
            WHERE s.requestedBy.userId = :dealerId
            """)
    Long countTotalStockByDealer(Long dealerId);

    // New queries for monthly trend - using LocalDateTime for comparison
    @Query("""
            SELECT COUNT(s)
            FROM StockRequest s
            WHERE s.requestedBy.userId = :dealerId
              AND s.requestDate >= :startDate
              AND s.requestDate < :endDate
            """)
    Long countStockRequestsByDealerAndDateRange(Long dealerId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("""
            SELECT COUNT(s)
            FROM StockRequest s
            WHERE s.requestedBy.userId = :dealerId
              AND s.status = 'APPROVED'
              AND s.requestDate >= :startDate
              AND s.requestDate < :endDate
            """)
    Long countApprovedStockByDealerAndDateRange(Long dealerId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("""
            SELECT COUNT(s)
            FROM StockRequest s
            WHERE s.requestedBy.userId = :dealerId
              AND s.status = 'PENDING'
              AND s.requestDate >= :startDate
              AND s.requestDate < :endDate
            """)
    Long countPendingStockByDealerAndDateRange(Long dealerId, LocalDateTime startDate, LocalDateTime endDate);
}