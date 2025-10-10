package com.erp.crm.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.crm.models.Sale;
import com.erp.crm.models.User;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findAllByDealer(User dealer);
    List<Sale> findAllByMarketer(User marketer);

}
