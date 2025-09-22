package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.dto.DealerProfileDto;
import com.erp.crm.models.DealerProfile;
import com.erp.crm.services.DealerProfileService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RequestMapping("/api/profiles")
@RestController
public class ProfileController {
    private final DealerProfileService dealerProfileService;

    public ProfileController(DealerProfileService dealerProfileService) {
        this.dealerProfileService = dealerProfileService;
    }
    
    @PostMapping("/dealer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DealerProfile> createDealerProfile(@RequestBody DealerProfileDto dto) {
        return ResponseEntity.ok(dealerProfileService.createProfile(dto));
    }

    @GetMapping("/dealer/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DealerProfile> getDealer(@PathVariable Long userId) {
        return ResponseEntity.ok(dealerProfileService.getProfileByUserId(userId));
    }

    @GetMapping("/dealer/all-dealers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DealerProfile>> getAllDealers() {

        return ResponseEntity.ok(dealerProfileService.getAllProfiles());
    }

    @PutMapping("/dealer/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DealerProfile> updateDealerProfile(@PathVariable Long userId, @RequestBody DealerProfileDto dto) {
        return ResponseEntity.ok(dealerProfileService.updateProfile(userId, dto));
    }


    @DeleteMapping("/dealer/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DealerProfile> deleteDealerProfile(@PathVariable Long userId) {
        dealerProfileService.deleteProfile(userId);
        return ResponseEntity.ok().build();
    }
    
}