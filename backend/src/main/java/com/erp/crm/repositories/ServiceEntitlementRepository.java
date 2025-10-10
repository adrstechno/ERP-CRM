package com.erp.crm.repositories;

import com.erp.crm.models.ServiceEntitlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceEntitlementRepository extends JpaRepository<ServiceEntitlement, Long> {

    // For one entitlement per sale (Optional)
    Optional<ServiceEntitlement> findBySale_SaleId(Long saleId);

    // For multiple entitlements per sale (List)
    List<ServiceEntitlement> findAllBySale_SaleId(Long saleId);
}
