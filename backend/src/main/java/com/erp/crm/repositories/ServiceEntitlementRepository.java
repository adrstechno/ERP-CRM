package com.erp.crm.repositories;

import com.erp.crm.models.ServiceEntitlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ServiceEntitlementRepository extends JpaRepository<ServiceEntitlement, Long> {
    Optional<ServiceEntitlement> findBySale_SaleId(Long saleId);
}