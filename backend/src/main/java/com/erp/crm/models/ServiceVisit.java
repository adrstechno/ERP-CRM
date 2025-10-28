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
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ServiceVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Linked Ticket
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private ServiceTicket ticket;

    // Engineer who performed the visit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engineer_id", nullable = false)
    private User engineer;

    // Start travel details
    private Double startKm;
    private String startKmPhotoUrl;

    // Part collection details (may happen during visit)
    private Double partCollectedKm;
    private String partCollectedPhotoUrl;

    // Arrival & repair details (end of visit)
    private Double endKm;
    private String endKmPhotoUrl;

    @Enumerated(EnumType.STRING)
    private ServiceStatus visitStatus; // EN_ROUTE, ON_SITE, NEED_PART, FIXED, COMPLETED, etc.

    // Parts used during this visit
    @Column(length = 500)
    private String usedParts;

    // If parts are missing
    @Column(length = 255)
    private String missingPart;

    // Optional note or comment by engineer
    @Column(length = 1000)
    private String remarks;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    private boolean active = true; // For soft delete in case needed later
}
