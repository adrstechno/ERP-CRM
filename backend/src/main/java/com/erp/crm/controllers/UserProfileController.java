package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.erp.crm.dto.UserProfileDTO;
import com.erp.crm.models.UserProfile;
import com.erp.crm.services.UserProfileService;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    //  Create profile (Admin only)
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> createProfile(@RequestBody UserProfileDTO dto) {
        return ResponseEntity.ok(userProfileService.createProfile(dto));
    }

    //  Get profile of currently authenticated user
    @GetMapping("/me")
    public ResponseEntity<UserProfile> getMyProfile() {
        return ResponseEntity.ok(userProfileService.getProfileOfCurrentUser());
    }

    //  Get all profiles (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfile>> getAllProfiles() {
        return ResponseEntity.ok(userProfileService.getAllProfiles());
    }

    //  Update profile (Admin can update any user by ID)
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long userId, @RequestBody UserProfileDTO dto) {
        return ResponseEntity.ok(userProfileService.updateProfile(userId, dto));
    }

    //  Update own profile (current user)
    @PutMapping("/me")
    public ResponseEntity<UserProfile> updateMyProfile(@RequestBody UserProfileDTO dto) {
        UserProfile profile = userProfileService.getProfileOfCurrentUser();
        return ResponseEntity.ok(userProfileService.updateProfile(profile.getUser().getUserId(), dto));
    }

    // Delete profile (Admin only)
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long userId) {
        userProfileService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }
}
