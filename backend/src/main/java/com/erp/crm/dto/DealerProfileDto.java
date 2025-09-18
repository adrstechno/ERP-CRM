package com.erp.crm.dto;

import lombok.Data;

@Data
public class DealerProfileDto {
    private Long userId;
    private String companyName;
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