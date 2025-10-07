package com.erp.crm.models;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate expenseDate;

    private String category;

    private BigDecimal amount;

    private String remarks;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private String invoiceUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;
}
