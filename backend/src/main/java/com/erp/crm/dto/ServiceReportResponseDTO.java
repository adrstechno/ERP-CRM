package com.erp.crm.dto;

import java.time.LocalDateTime;
import com.erp.crm.models.ServiceReport;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceReportResponseDTO {
    private Long reportId;
    private Long ticketId;
    private String engineerName;
    private String partsUsed;
    private Double additionalCharges;
    private String description;
    private String receiptURL;
    private LocalDateTime createdAt;

    public static ServiceReportResponseDTO fromEntity(ServiceReport report) {
        ServiceReportResponseDTO dto = new ServiceReportResponseDTO();
        dto.setReportId(report.getReportId());
        dto.setTicketId(report.getTicket().getId());
        dto.setEngineerName(report.getEngineer().getName());
        dto.setPartsUsed(report.getPartsUsed());
        dto.setAdditionalCharges(report.getAdditionalCharges());
        dto.setDescription(report.getDescription());
        dto.setReceiptURL(report.getReceiptURL());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
