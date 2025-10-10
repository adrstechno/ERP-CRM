package com.erp.crm.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.crm.models.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

List<Sale> findAllByCreatedByUserId(Long userId);

}
