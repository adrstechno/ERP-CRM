package com.erp.crm.repositories;

import com.erp.crm.models.ServiceReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ServiceReportRepository extends JpaRepository<ServiceReport, Long> {
    Optional<ServiceReport> findByTicket_Id(Long ticketId);
    List<ServiceReport> findAllByEngineer_UserId(Long userId);
}
