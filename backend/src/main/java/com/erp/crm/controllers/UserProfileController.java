package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.AdminCreateUserDTO;
import com.erp.crm.dto.UserDTO;
import com.erp.crm.dto.UserProfileDto;
import com.erp.crm.models.User;
import com.erp.crm.models.UserProfile;
import com.erp.crm.services.UserProfileService;
import com.erp.crm.services.UserService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserService userService;

    public UserProfileController(UserProfileService userProfileService,UserService userService) {
        this.userProfileService = userProfileService;
        this.userService = userService;
    }

    // ✅ Create profile (any role)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> createProfile(@RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userProfileService.createProfile(dto));
    }

    // ✅ Get profile by userId
    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUBADMIN','DEALER','MARKETER','ENGINEER')")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userProfileService.getProfileByUserId(userId));
    }

    // ✅ Get all profiles (optionally filter by role)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfile>> getAllProfiles() {
        return ResponseEntity.ok(userProfileService.getAllProfiles());
    }

    // ✅ Update profile
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long userId, @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userProfileService.updateProfile(userId, dto));
    }

    // ✅ Delete profile
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long userId) {
        userProfileService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }

    //  ✅ Update User
    @PutMapping("/update/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long userId,@RequestBody UserDTO dto){
         return ResponseEntity.ok(userService.updateUser(userId, dto));
    }
}

