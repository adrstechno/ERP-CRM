package com.erp.crm.dto;

import com.erp.crm.models.ServiceStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceVisitResponseDTO {

    private Long id;
    private Long ticketId;
    private String engineerName;

    private Double startKm;
    private String startKmPhotoUrl;

    private Double endKm;
    private String endKmPhotoUrl;



    private Boolean partCollectedSameDay;

    private ServiceStatus visitStatus; // EN_ROUTE, ON_SITE, NEED_PART, etc.
    private boolean active; // True if current visit is ongoing
    private boolean nextDayRequired; // True if visit marked as 'need part' and engineer will return later

    private String usedParts; // List of parts used
    private String missingPart; // Parts required for next visit
    private String remarks; // General visit remarks or notes

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    private ServiceStatus ticketStatus; // Mirror of ticket’s overall status

    private String lastUpdatedBy; // Engineer/Manager who last modified
    private LocalDateTime lastUpdatedAt;
}
