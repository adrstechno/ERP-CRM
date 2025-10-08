package com.erp.crm.controllers;

import com.cloudinary.Api;
import com.erp.crm.config.ApiResponse;
import com.erp.crm.dto.PaymentRequestDTO;
import com.erp.crm.dto.PaymentResponseDTO;
import com.erp.crm.models.PaymentStatus;
import com.erp.crm.services.FileUploadService;
import com.erp.crm.services.PaymentService;

import org.apache.tomcat.util.http.fileupload.FileUpload;
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
            @RequestPart(value = "proofFile", required = false) MultipartFile proofFile) {
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

    // --------------------- Get Payments by Invoice ---------------------
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentService.getPaymentsByInvoice(invoiceId));
    }
}