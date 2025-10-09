package com.erp.crm.dto;

import java.time.LocalDate;

import com.erp.crm.models.PaymentStatus;
import lombok.Data;

@Data
public class InvoiceResponseDTO {
    private Long invoiceId;
    private LocalDate invoiceDate;
    private String invoiceNumber;
    private PaymentStatus paymentStatus;
    private Double totalAmount;
    private SaleResponseDTO sale;
    private Double outstandingAmount;
}
