package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.AdminCreateUserDTO;
import com.erp.crm.models.User;
import com.erp.crm.services.UserService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody @Valid AdminCreateUserDTO dto) {
        User newUser = userService.createUser(dto);
        System.out.println(newUser.getPhone());
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUser(){
        List<User> users = userService.getAllUser();
        System.out.println(users);
        return users;
    }

    // get user by role
    @GetMapping("/users/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUserByRole(@PathVariable String role){
        List<User> users = userService.getAllUserByRole(role);
        System.out.println(users);
        return users;
    }
    
}
