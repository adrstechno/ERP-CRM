package com.erp.crm.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "service_reports")
public class ServiceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @OneToOne
    @JoinColumn(name = "ticket_id", nullable = false, unique = true)
    private ServiceTicket ticket;

    @ManyToOne
    @JoinColumn(name = "engineer_id", nullable = false)
    private User engineer;

    @Column(length = 2000)
    private String description;

    @Column(length = 500)
    private String partsUsed;

    private Double additionalCharges;

    private String receiptURL;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Double startKm;
    private Double endKm;
    private String startKmPhotoUrl;
    private String endKmPhotoUrl;
    private Double totalDistance; 
    @Column(length = 1000)
    private String usedPartsDetails; 
    @Column(length = 500)
    private String missingParts; 

}
