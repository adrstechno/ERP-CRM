package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class NoticeResponseDTO {
    private Long noticeId;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private String createdBy;
    private Boolean isGlobal;
    private String targetUser;
}
