package com.erp.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.dto.UserProfileDTO;
import com.erp.crm.models.User;
import com.erp.crm.models.UserProfile;
import com.erp.crm.repositories.UserProfileRepository;
import com.erp.crm.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    // Create a profile for a user (only once).

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

    // Get profile by user id.

    public UserProfile getProfileByUserId(Long userId) {
        return userProfileRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("❌ Profile not found for userId: " + userId));
    }

    // Get all profiles.

    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }

    // Update an existing profile by user id.

    @Transactional
    public UserProfile updateProfile(Long userId, UserProfileDTO dto) {
        UserProfile existingProfile = getProfileByUserId(userId);
        return userProfileRepository.save(mapDtoToEntity(existingProfile, dto));
    }

    /**
     * Delete profile by user id.
     */
   @Transactional
    public void deleteProfile(Long userId) {
        userProfileRepository.deleteByUserId(userId);
    }

    /**
     * Utility: Map DTO fields to entity (centralized mapping logic).
     */
    private UserProfile mapDtoToEntity(UserProfile profile, UserProfileDTO dto) {
        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setPincode(dto.getPincode());
        profile.setAccountNo(dto.getAccountNumber());
        profile.setBankName(dto.getBankName());
        profile.setIfscCode(dto.getIfscCode());
        profile.setGstNumber(dto.getGstNumber());
        profile.setPanNumber(dto.getPanNumber());

        return profile;
    }
}
