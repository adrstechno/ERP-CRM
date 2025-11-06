package com.erp.crm.repositories;

import com.erp.crm.models.Payment;
import com.erp.crm.models.PaymentStatus;
import com.erp.crm.models.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByInvoice_InvoiceId(Long invoiceId);

    List<Payment> findByReceivedBy(User receivedBy);

    // Find payments by status
    List<Payment> findByStatus(PaymentStatus status);

    // Find payments by status and date range
    List<Payment> findByStatusAndPaymentDateBetween(PaymentStatus status, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentDate BETWEEN :start AND :end")
    Double getTotalPayments(LocalDate start, LocalDate end);

    @Query("SELECT SUM(i.totalAmount) - SUM(COALESCE(p.amount,0)) FROM Invoice i LEFT JOIN i.payments p WHERE i.invoiceDate BETWEEN :start AND :end")
    Double getOutstandingPayments(LocalDate start, LocalDate end);

    boolean existsByInvoice_InvoiceIdAndStatus(Long invoiceId, PaymentStatus status);

    
    // Additional method for marketer analytics
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
}