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

    private ServiceStatus visitStatus;
    private String usedParts;
    private String missingPart;
    private String remarks;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
}
