package com.erp.crm.controllers;

import com.erp.crm.config.ApiResponse;
import com.erp.crm.dto.PaymentRequestDTO;
import com.erp.crm.dto.PaymentResponseDTO;
import com.erp.crm.models.PaymentStatus;
import com.erp.crm.services.FileUploadService;
import com.erp.crm.services.PaymentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final FileUploadService fileUploadService;

    public PaymentController(PaymentService paymentService, FileUploadService fileUploadService) {
        this.paymentService = paymentService;
        this.fileUploadService = fileUploadService;
    }

    // --------------------- Record Payment ---------------------
    @PostMapping("/add-payment")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> recordPayment(@ModelAttribute PaymentRequestDTO dto,
            @RequestParam(value = "proofFile", required = false) MultipartFile proofFile) {
        System.out.println(proofFile + "``````````````````");
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Payment recorded successfully",
                        paymentService.recordPayment(dto, proofFile)));
    }

    // --------------------- Admin Approve / Reject Payment ---------------------
    @PatchMapping("/{paymentId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam PaymentStatus status) {

        ApiResponse<PaymentResponseDTO> response = paymentService.updatePaymentStatus(paymentId, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getAllPaymentsByReceivedBy() {
        try {
            List<PaymentResponseDTO> payments = paymentService.getPaymentsByUser();

            ApiResponse<List<PaymentResponseDTO>> response = new ApiResponse<>(
                    true,
                    "Payments fetched successfully",
                    payments);

            return ResponseEntity.ok(response);

        } catch (RuntimeException ex) {
            ApiResponse<List<PaymentResponseDTO>> response = new ApiResponse<>(
                    false,
                    ex.getMessage(),
                    null);

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // --------------------- Get Payments by Invoice ---------------------
    @GetMapping("/{invoiceId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentService.getPaymentsByInvoice(invoiceId));
    }

}