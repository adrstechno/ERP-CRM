package com.erp.crm.repositories;

import com.erp.crm.models.ServiceStatus;
import com.erp.crm.models.ServiceTicket;
import com.erp.crm.models.User;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTicketRepository extends JpaRepository<ServiceTicket, Long> {

    // Check if OPEN ticket exists for given sale and product
    boolean existsBySale_SaleIdAndProduct_ProductIdAndServiceStatusIn(Long saleId, Long productId,
            List<ServiceStatus> statuses);

    List<ServiceTicket> findByAssignedEngineer(User assignedEngineer);
    
    // Find tickets by date range for analytics
    List<ServiceTicket> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
