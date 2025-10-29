package com.erp.crm.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "service_visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Builder
public class ServiceVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Each visit belongs to a specific service ticket
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private ServiceTicket ticket;

    // Engineer assigned to this visit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engineer_id", nullable = false)
    private User engineer;

    // Optional link to a previous visit (for next-day continuation)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_visit_id")
    private ServiceVisit previousVisit;

    private Double startKm;
    private String startKmPhotoUrl;

    private Double endKm;
    private String endKmPhotoUrl;

    // For same-day part collection
    private Double partCollectedKm;
    private String partCollectedPhotoUrl;

    @Enumerated(EnumType.STRING)
    private ServiceStatus visitStatus; // IN_PROGRESS, NEED_PART, COMPLETED

    @Column(length = 255)
    private String missingPart; // Name or description of missing part

    @Column(length = 500)
    private String usedParts; // If any part used during visit

    @Column(length = 1000)
    private String remarks; // General engineer remarks

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    private boolean partCollectedSameDay = false;
    private boolean active = true; // For soft delete or filtering

    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
