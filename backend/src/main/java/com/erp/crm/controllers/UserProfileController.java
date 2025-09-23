package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.UserProfileDto;
import com.erp.crm.models.UserProfile;
import com.erp.crm.services.UserProfileService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RequestMapping("/api/profiles")
@RestController
public class UserProfileController {
    private final UserProfileService UserProfileService;

    public UserProfileController(UserProfileService UserProfileService) {
        this.UserProfileService = UserProfileService;
    }
    
    @PostMapping("/dealer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> createUserProfile(@RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(UserProfileService.createProfile(dto));
    }

    @GetMapping("/dealer/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> getDealer(@PathVariable Long userId) {
        return ResponseEntity.ok(UserProfileService.getProfileByUserId(userId));
    }

    @GetMapping("/dealer/all-dealers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfile>> getAllDealers() {

        return ResponseEntity.ok(UserProfileService.getAllProfiles());
    }

    @PutMapping("/dealer/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> updateUserProfile(@PathVariable Long userId, @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(UserProfileService.updateProfile(userId, dto));
    }


    @DeleteMapping("/dealer/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> deleteUserProfile(@PathVariable Long userId) {
        UserProfileService.deleteProfile(userId);
        return ResponseEntity.ok().build();
    }
    
}