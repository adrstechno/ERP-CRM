package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeRequestDTO {
    private String title;
    private String message;
    private Long targetUserId;  // null = all users
}
