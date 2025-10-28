package com.erp.crm.services;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.dto.UserProfileDTO;
import com.erp.crm.models.User;
import com.erp.crm.models.UserProfile;
import com.erp.crm.repositories.UserProfileRepository;
import com.erp.crm.repositories.UserRepository;
import com.erp.crm.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    // Create a profile for a user (only once)
    @Transactional
    public UserProfile createProfile(UserProfileDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("❌ User not found with id: " + dto.getUserId()));

        if (userProfileRepository.findByUserUserId(user.getUserId()).isPresent()) {
            throw new RuntimeException("❌ Profile already exists for user id: " + dto.getUserId());
        }

        UserProfile profile = mapDtoToEntity(new UserProfile(), dto);
        profile.setUser(user);

        return userProfileRepository.save(profile);
    }

    // Get profile of currently authenticated user
    public UserProfile getProfileOfCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return userProfileRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("❌ Profile not found for userId: " + user.getUserId()));
    }

    // Get profile by any userId (admin use-case)
    public UserProfile getProfileByUserId(Long userId) {
        return userProfileRepository.findByUserUserId(userId)
                .orElse(null);
    }

    // Get all profiles
    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }

    // Update profile by userId (admin) or current authenticated user
    @Transactional
    public UserProfile updateProfile(Long userId, UserProfileDTO dto) {
        UserProfile existingProfile = getProfileByUserId(userId);
        return userProfileRepository.save(mapDtoToEntity(existingProfile, dto));
    }

    // Delete profile by userId
    @Transactional
    public void deleteProfile(Long userId) {
        UserProfile profile = getProfileByUserId(userId);
        userProfileRepository.delete(profile);
    }

    // Utility: Map DTO fields to entity
    private UserProfile mapDtoToEntity(UserProfile profile, UserProfileDTO dto) {
        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setPincode(dto.getPincode());
        profile.setAccountNo(dto.getAccountNo());
        profile.setBankName(dto.getBankName());
        profile.setIfscCode(dto.getIfscCode());
        profile.setGstNumber(dto.getGstNumber());
        profile.setPanNumber(dto.getPanNumber());

        return profile;
    }
}
