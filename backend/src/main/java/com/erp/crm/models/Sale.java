package com.erp.crm.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sales")
@Getter
@Setter
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    private Long saleId;

    // Admin (super stockist)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    // Created by marketer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marketer_id", nullable = false)
    private User marketer;

    // Dealer as customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealer_id")
    private User dealer;

    // Retail customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retail_customer_id")
    private Customer retailCustomer;

    @Column(nullable = false)
    private LocalDate saleDate;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private SaleStatus saleStatus = SaleStatus.PENDING;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleItem> saleItems;
    
    @OneToOne(mappedBy = "sale", cascade = CascadeType.ALL)
    private Invoice invoice;
}
