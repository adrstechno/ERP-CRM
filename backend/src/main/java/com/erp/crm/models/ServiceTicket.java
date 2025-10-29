package com.erp.crm.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "service_tickets")
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ServiceTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engineer_id", nullable = false)
    private User assignedEngineer;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private ServiceStatus serviceStatus = ServiceStatus.OPEN;

    private LocalDate dueDate;

    @Column(updatable = false)
    private LocalDate createdAt = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private EntitlementType entitlementType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_entitlement_id")
    private ServiceEntitlement serviceEntitlement;

    private Double startKm;
    private String startKmPhotoUrl;
    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;
    private String missingPart;

    private Double partCollectedKm;
    private String partCollectedPhotoUrl;

    private Double endKm;
    private String endKmPhotoUrl;
    private String usedParts;

    private LocalDateTime workCompletedTime;
    private LocalDateTime completionTime;

}
