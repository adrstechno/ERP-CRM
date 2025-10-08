package com.erp.crm.repositories;

import com.erp.crm.models.Invoice;
import com.erp.crm.models.PaymentStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findBySale_SaleId(Long saleId);
    
    // Find all unpaid invoices
    List<Invoice> findByPaymentStatus(PaymentStatus status);

}