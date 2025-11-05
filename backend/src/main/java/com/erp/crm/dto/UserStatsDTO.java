package com.erp.crm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatsDTO {
    private String role;
    private Long totalUsers;
    private Long activeUsers;
}
