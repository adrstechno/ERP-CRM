package com.erp.crm.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.AdminCreateUserDTO;
import com.erp.crm.models.User;
import com.erp.crm.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody @Valid AdminCreateUserDTO dto) {
        User newUser = userService.createUser(dto);
        return ResponseEntity.ok(newUser);
    }
    
}
