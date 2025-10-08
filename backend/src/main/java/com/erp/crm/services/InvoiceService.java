package com.erp.crm.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.erp.crm.dto.InvoiceResponseDTO;
import com.erp.crm.dto.SaleResponseDTO;
import com.erp.crm.models.Invoice;
import com.erp.crm.repositories.InvoiceRepository;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepo;

    @Autowired
    private SaleService saleService;

    public InvoiceResponseDTO getInvoice(Long saleId){
        Invoice invoice = invoiceRepo.findBySale_SaleId(saleId).orElseThrow(()-> new RuntimeException("No invoice found with sale Id : "+ saleId));
        SaleResponseDTO sale  = saleService.getSale(saleId);

        return mapToDto(invoice,sale);
    }

    public InvoiceResponseDTO mapToDto(Invoice invoice,SaleResponseDTO sale){
        InvoiceResponseDTO invoiceResponse = new InvoiceResponseDTO();
        invoiceResponse.setInvoiceId(invoice.getInvoiceId());
        invoiceResponse.setInvoiceDate(invoice.getInvoiceDate());
        invoiceResponse.setInvoiceNumber(invoice.getInvoiceNumber());
        invoiceResponse.setPaymentStatus(invoice.getPaymentStatus());
        invoiceResponse.setTotalAmount(invoice.getTotalAmount());
        invoiceResponse.setSale(sale);
        return invoiceResponse;
    }
}
