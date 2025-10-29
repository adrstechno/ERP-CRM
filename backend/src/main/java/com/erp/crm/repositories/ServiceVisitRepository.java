package com.erp.crm.repositories;

import com.erp.crm.models.ServiceVisit;
import com.erp.crm.models.ServiceTicket;
import com.erp.crm.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceVisitRepository extends JpaRepository<ServiceVisit, Long> {
    List<ServiceVisit> findByTicket(ServiceTicket ticket);
    List<ServiceVisit> findByEngineer(User engineer);
}
