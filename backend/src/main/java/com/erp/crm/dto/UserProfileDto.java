package com.erp.crm.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long userId;
    private String gstNumber;
    private String panNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
}