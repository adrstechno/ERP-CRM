package com.erp.crm.controllers;

import com.erp.crm.config.ApiResponse;
import com.erp.crm.services.FileUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test-files")
public class FileUploadTestController {

    private final FileUploadService fileUploadService;

    public FileUploadTestController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    // Test invoice upload
    @PostMapping("/invoice/{invoiceId}")
    public ResponseEntity<ApiResponse<String>> uploadInvoice(
            @PathVariable Long invoiceId,
            @RequestParam("file") MultipartFile file) {
        String fileUrl = fileUploadService.uploadInvoice(file, invoiceId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Invoice uploaded successfully", fileUrl));
    }

    // Test receipt upload
    @PostMapping("/receipt/{expenseId}")
    public ResponseEntity<ApiResponse<String>> uploadReceipt(
            @PathVariable Long expenseId,
            @RequestParam("file") MultipartFile file) {
        String fileUrl = fileUploadService.uploadReceipt(file, expenseId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Receipt uploaded successfully", fileUrl));
    }

    // Test product/service status image upload
    @PostMapping("/product-status/{productId}")
    public ResponseEntity<ApiResponse<String>> uploadProductStatus(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {
        String fileUrl = fileUploadService.uploadProductStatus(file, productId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product status image uploaded successfully", fileUrl));
    }
}
