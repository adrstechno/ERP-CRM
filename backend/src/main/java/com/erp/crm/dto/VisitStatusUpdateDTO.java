package com.erp.crm.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitStatusUpdateDTO {
    private String missingPart;
    private String remarks;
    private String usedParts;
    private Double endKm;
    private MultipartFile endKmPhoto;
    private boolean directlyComplete;
    private boolean partUnavailableToday;
}
