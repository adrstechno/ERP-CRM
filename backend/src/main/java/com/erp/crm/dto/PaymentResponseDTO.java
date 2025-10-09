package com.erp.crm.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private Long invoiceId;
    private String invoiceNumber;
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String referenceNo;
    private String status;
    private String proofUrl;
    private String receivedBy;
}