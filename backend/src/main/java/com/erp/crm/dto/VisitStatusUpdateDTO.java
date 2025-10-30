package com.erp.crm.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VisitStatusUpdateDTO {
    // --- For NEED_PART ---
    private String missingPart;
    private String remarks;
    private boolean partUnavailableToday;

    private Double partCollectedKm;
    private MultipartFile partCollectedPhoto;

    // --- For FIXED or COMPLETED ---
    private Double endKm;
    private MultipartFile endKmPhoto;
    private String usedParts;
    private boolean directlyComplete;
}
