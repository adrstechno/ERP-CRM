package com.erp.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerDTO {
    @NotBlank(message = "Customer's name is required")
    private String customerName;

    @NotBlank(message = "Customer's phone is required")
    private String phone;

    @Email(message = "Invalid email format")
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "Customer's Address is required")
    private String address;
}
