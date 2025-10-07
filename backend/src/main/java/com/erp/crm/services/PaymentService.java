package com.erp.crm.services;

import com.erp.crm.dto.PaymentRequestDTO;
import com.erp.crm.dto.PaymentResponseDTO;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepo;
    private final InvoiceRepository invoiceRepo;
    
    public PaymentService(PaymentRepository paymentRepo, InvoiceRepository invoiceRepo) {
        this.paymentRepo = paymentRepo;
        this.invoiceRepo = invoiceRepo;
    }
    
    public PaymentResponseDTO recordPayment(PaymentRequestDTO dto) {
        Invoice invoice = invoiceRepo.findById(dto.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        // ✅ Validate payment amount
        double totalPaid = invoice.getPayments().stream()
                .mapToDouble(Payment::getAmount)
                .sum();
        
        double remaining = invoice.getTotalAmount() - totalPaid;
        
        if (dto.getAmount() > remaining) {
            throw new RuntimeException("Payment amount exceeds remaining balance");
        }
        
        // ✅ Create payment entry
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setPaymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDate.now());
        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setReferenceNo(dto.getReferenceNo());
        
        Payment savedPayment = paymentRepo.save(payment);
        
        // ✅ Update invoice payment status
        updateInvoicePaymentStatus(invoice);
        
        return mapToDto(savedPayment);
    }
    
    private void updateInvoicePaymentStatus(Invoice invoice) {
        double totalPaid = invoice.getPayments().stream()
                .mapToDouble(Payment::getAmount)
                .sum();
        
        double totalAmount = invoice.getTotalAmount();
        
        if (totalPaid >= totalAmount) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
        } else if (totalPaid > 0) {
            invoice.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        } else {
            invoice.setPaymentStatus(PaymentStatus.UNPAID);
        }
        
        invoiceRepo.save(invoice);
    }
    
    public List<PaymentResponseDTO> getPaymentsByInvoice(Long invoiceId) {
        return paymentRepo.findByInvoice_InvoiceId(invoiceId).stream()
                .map(this::mapToDto)
                .toList();
    }
    
    private PaymentResponseDTO mapToDto(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setInvoiceId(payment.getInvoice().getInvoiceId());
        dto.setInvoiceNumber(payment.getInvoice().getInvoiceNumber());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethod(payment.getPaymentMethod().name());
        dto.setReferenceNo(payment.getReferenceNo());
        return dto;
    }
}