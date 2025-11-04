package com.erp.crm.services;

import com.erp.crm.config.ApiResponse;
import com.erp.crm.dto.PaymentRequestDTO;
import com.erp.crm.dto.PaymentResponseDTO;
import com.erp.crm.models.*;
import com.erp.crm.repositories.*;
import com.erp.crm.security.UserPrincipal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

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
        Invoice invoice = invoiceRepo.findById(dto.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (dto.getAmount() > invoice.getOutstandingAmount()) {
            throw new RuntimeException("Payment amount exceeds remaining balance");
        }

        double remaining = invoice.getOutstandingAmount() - dto.getAmount();

        // invoice.setOutstandingAmount(remaining); // invoice ke current remaining ko
        // update karo

        // ✅ Create payment entry
        Payment payment = new Payment();
        payment.setRemainingAmount(remaining); // only for THIS payment
        payment.setInvoice(invoice);
        payment.setPaymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDate.now());
        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setReferenceNo(dto.getReferenceNo());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setNotes(dto.getNotes());
        payment.setRemainingAmount(remaining);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));


        if (proofFile != null && !proofFile.isEmpty()) {
            String uploadedUrl = fileUploadService.uploadReceipt(proofFile, payment.getInvoice().getInvoiceId());
            System.out.println("Uploaded proof URL: " + uploadedUrl);
            payment.setProofUrl(uploadedUrl);
        }

        if (user != null) {

            payment.setReceivedBy(user);
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
        // If approved, adjust the invoice's outstanding amount
        if (newStatus == PaymentStatus.APPROVED) {
            Invoice invoice = invoiceRepo.findById(payment.getInvoice().getInvoiceId())
                    .orElseThrow(() -> new RuntimeException(
                            "Invoice not found with ID: " + payment.getInvoice().getInvoiceId()));
            invoice.setOutstandingAmount(invoice.getOutstandingAmount() - payment.getAmount());
        }

        paymentRepo.save(payment);

        // Update invoice totals accordingly
        updateInvoicePaymentStatus(payment.getInvoice());

        return new ApiResponse<>(true, "Payment " + newStatus.name().toLowerCase(), mapToDto(payment));
    }

    /**
     * Get all payments by invoice
     */

    public List<PaymentResponseDTO> getPaymentsByInvoice(Long invoiceId) {

        Invoice invoice = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + invoiceId));

        List<Payment> payments = paymentRepo.findByInvoice_InvoiceId(invoiceId);

        if (payments == null || payments.isEmpty()) {
            throw new RuntimeException("No payments found for Invoice ID: " + invoiceId);
        }
        return paymentRepo.findByInvoice_InvoiceId(invoiceId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<PaymentResponseDTO> getPaymentsByUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<Payment> payments = paymentRepo.findByReceivedBy(user);

        if (payments.isEmpty()) {
            throw new RuntimeException("No payments found for userId: " + user.getUserId());

        }
        return payments.stream().map(this::mapToDto).toList();
    }

    /**
     * Get monthly payment collection data for charts
     */
    public List<Map<String, Object>> getMonthlyPaymentCollection() {
        // Get payments from last 12 months that are approved
        LocalDate startDate = LocalDate.now().minusMonths(11).withDayOfMonth(1);
        LocalDate endDate = LocalDate.now();
        
        List<Payment> approvedPayments = paymentRepo.findByStatusAndPaymentDateBetween(
            PaymentStatus.APPROVED, startDate, endDate);
        
        // Group payments by month and sum amounts
        Map<String, Double> monthlyData = approvedPayments.stream()
            .collect(Collectors.groupingBy(
                payment -> payment.getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                LinkedHashMap::new,
                Collectors.summingDouble(Payment::getAmount)
            ));
        
        // Fill in missing months with zero values
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            YearMonth month = YearMonth.now().minusMonths(i);
            String monthKey = month.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            
            Map<String, Object> monthData = new LinkedHashMap<>();
            monthData.put("month", monthKey);
            monthData.put("totalAmount", monthlyData.getOrDefault(monthKey, 0.0));
            result.add(monthData);
        }
        
        return result;
    }

    /**
     * Get payment statistics for dashboard
     */
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new LinkedHashMap<>();
        
        // Total payments (approved only)
        Double totalPayments = paymentRepo.findByStatus(PaymentStatus.APPROVED)
            .stream()
            .mapToDouble(Payment::getAmount)
            .sum();
        
        // Outstanding payments (pending + unpaid invoices)
        Double outstandingPayments = paymentRepo.findByStatus(PaymentStatus.PENDING)
            .stream()
            .mapToDouble(Payment::getAmount)
            .sum();
        
        // This month's collection
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now();
        Double thisMonthCollection = paymentRepo.findByStatusAndPaymentDateBetween(
            PaymentStatus.APPROVED, startOfMonth, endOfMonth)
            .stream()
            .mapToDouble(Payment::getAmount)
            .sum();
        
        stats.put("totalPayments", totalPayments);
        stats.put("outstandingPayments", outstandingPayments);
        stats.put("thisMonthCollection", thisMonthCollection);
        
        return stats;
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
        dto.setRemainingBalance(payment.getRemainingAmount());
        dto.setTotalBalance(payment.getInvoice().getTotalAmount());
        dto.setNotes(payment.getNotes());
        return dto;

    }
}