package com.erp.crm.repositories;

import com.erp.crm.models.ServiceTicket;
import com.erp.crm.models.Status;
import com.erp.crm.models.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTicketRepository extends JpaRepository<ServiceTicket, Long> {

    // Check if OPEN ticket exists for given sale and product
     boolean existsBySale_SaleIdAndProduct_ProductIdAndStatusIn(Long saleId, Long productId, Iterable<Status> statuses);

     List<ServiceTicket> findByAssignedEngineer(User assignedEngineer);
}
