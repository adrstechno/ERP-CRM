package com.erp.crm.repositories;

import com.erp.crm.models.Payment;
import com.erp.crm.models.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByInvoice_InvoiceId(Long invoiceId);

    List<Payment> findByReceivedBy(User receivedBy);
}