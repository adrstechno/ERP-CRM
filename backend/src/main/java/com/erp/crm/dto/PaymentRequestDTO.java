package com.erp.crm.dto;

import com.erp.crm.models.PaymentMethod;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PaymentRequestDTO {
    private Long invoiceId;
    private Double amount;
    private PaymentMethod paymentMethod;  // CASH, UPI, BANK_TRANSFER, etc.
    private String referenceNo;
    private LocalDate paymentDate;
}