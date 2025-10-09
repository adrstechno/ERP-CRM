package com.erp.crm.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.InvoiceResponseDTO;
import com.erp.crm.services.InvoiceService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/invoices/")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;
    
    @GetMapping("/{saleId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoice(@PathVariable Long saleId){
        return ResponseEntity.ok(invoiceService.getInvoice(saleId));
    }
}
