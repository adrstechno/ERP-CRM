package com.erp.crm.repositories;

import com.erp.crm.models.ServiceEntitlement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceEntitlementRepository extends JpaRepository<ServiceEntitlement, Long> {
    List<ServiceEntitlement> findBySale_SaleId(Long saleId);

    Optional<ServiceEntitlement> findBySale_SaleIdAndProduct_ProductId(Long saleId, Long productId);
}
