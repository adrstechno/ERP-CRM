package com.erp.crm.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String password;
    private String phone;
    private Boolean isActive;

}
