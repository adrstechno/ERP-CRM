package com.erp.crm.repositories;

import com.erp.crm.models.ServiceTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTicketRepository extends JpaRepository<ServiceTicket, Long> {
}
