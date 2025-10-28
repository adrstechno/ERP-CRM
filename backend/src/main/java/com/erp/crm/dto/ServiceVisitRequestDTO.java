package com.erp.crm.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceVisitRequestDTO {

    private Double startKm;
    private MultipartFile startKmPhoto;

    private Double endKm;
    private MultipartFile endKmPhoto;

    private String missingPart;
    private String remarks;
    private String usedParts;

    private boolean directlyComplete;
    private boolean partUnavailableToday;
}
