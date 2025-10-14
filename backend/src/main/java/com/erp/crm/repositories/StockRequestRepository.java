package com.erp.crm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.Status;
import com.erp.crm.models.StockRequest;
import java.util.List;

public interface StockRequestRepository extends JpaRepository<StockRequest, Long> {
    List<StockRequest> findByRequestedBy_UserId(Long userId);
    List<StockRequest> findByStatus(Status status);
}
