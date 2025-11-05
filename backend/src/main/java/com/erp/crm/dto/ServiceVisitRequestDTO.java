package com.erp.crm.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceVisitRequestDTO {

    private Double startKm;
    private MultipartFile startKmPhoto;
}
