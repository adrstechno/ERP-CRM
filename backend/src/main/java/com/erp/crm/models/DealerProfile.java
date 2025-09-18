package com.erp.crm.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "dealer_profiles")

public class DealerProfile {
    @Id
    @Column(name = "dealer_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String gstNumber;
    private String panNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;

    private String accountNo;
    @Column(name = "bank_name")
    private String bankName;
    @Column(name = "ifsc_code")
    private String ifscCode;

}
