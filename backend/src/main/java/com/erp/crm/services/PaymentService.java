package com.erp.crm.services;

import com.erp.crm.config.ApiResponse;
import com.erp.crm.dto.PaymentRequestDTO;
import com.erp.crm.dto.PaymentResponseDTO;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final InvoiceRepository invoiceRepo;
    private final FileUploadService fileUploadService;
    private final UserRepository userRepo;

    /**
     * Record a new payment (marketer/dealer uploads proof)
     */
    public PaymentService(PaymentRepository paymentRepo, InvoiceRepository invoiceRepo,
            FileUploadService fileUploadService, UserRepository userRepo) {
        this.paymentRepo = paymentRepo;
        this.invoiceRepo = invoiceRepo;
        this.fileUploadService = fileUploadService;
        this.userRepo = userRepo;
    }

    public PaymentResponseDTO recordPayment(PaymentRequestDTO dto, MultipartFile proofFile) {
        System.out.println(proofFile + " lkdsalfajsljl ");
        Invoice invoice = invoiceRepo.findById(dto.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // Validate payment amount
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
        payment.setStatus(PaymentStatus.PENDING);

        User user = userRepo.findById(dto.getReceivedById())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getReceivedById()));
        payment.setReceivedBy(user);

        if (proofFile != null && !proofFile.isEmpty()) {
            String uploadedUrl = fileUploadService.uploadReceipt(proofFile, payment.getInvoice().getInvoiceId());
            System.out.println("Uploaded proof URL: " + uploadedUrl);
            payment.setProofUrl(uploadedUrl);
        }

        if (dto.getReceivedById() != null) {
            User receivedBy = userRepo.findById(dto.getReceivedById())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            payment.setReceivedBy(receivedBy);
        }

        Payment savedPayment = paymentRepo.save(payment);

        // ✅ Update invoice payment status
        updateInvoicePaymentStatus(invoice);

        return mapToDto(savedPayment);
    }

    /**
     * Update invoice payment status (Paid / Partially / Unpaid)
     */
    private void updateInvoicePaymentStatus(Invoice invoice) {
        double totalPaid = invoice.getPayments().stream()
                .filter(p -> p.getStatus() == PaymentStatus.APPROVED) // only approved ones count
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

    /**
     * Admin approves or rejects payment
     */

    public ApiResponse<PaymentResponseDTO> updatePaymentStatus(Long paymentId, PaymentStatus newStatus) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(newStatus);
        paymentRepo.save(payment);

        // Update invoice totals accordingly
        updateInvoicePaymentStatus(payment.getInvoice());

        return new ApiResponse<>(true, "Payment " + newStatus.name().toLowerCase(), mapToDto(payment));
    }

    /**
     * Get all payments by invoice
     */

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
        dto.setStatus(payment.getStatus().name());
        dto.setProofUrl(payment.getProofUrl());
        dto.setReceivedBy(payment.getReceivedBy() != null ? payment.getReceivedBy().getName() : null);
        return dto;

    }
}