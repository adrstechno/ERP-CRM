package com.erp.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erp.crm.dto.DealerProfileDto;
import com.erp.crm.models.DealerProfile;
import com.erp.crm.models.User;
import com.erp.crm.repositories.DealerRepository;
import com.erp.crm.repositories.UserRepository;

@Service
public class DealerProfileService {
    private final DealerRepository dealerRepository;
    private final UserRepository userRepository;

    public DealerProfileService(DealerRepository dealerRepository, UserRepository userRepository) {
        this.dealerRepository = dealerRepository;
        this.userRepository = userRepository;
    }

    public DealerProfile createProfile(DealerProfileDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found" + dto.getUserId()));

        if (dealerRepository.findByUserId(user.getUserId()).isPresent()) {
            throw new RuntimeException("Profile already exists for user id : " + dto.getUserId());
        }

        DealerProfile profile = new DealerProfile();
        profile.setUser(user);
        profile.setGstNumber(dto.getGstNumber());
        profile.setPanNumber(dto.getPanNumber());
        profile.setAccountNo(dto.getAccountNumber());
        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setPincode(dto.getPincode());
        profile.setBankName(dto.getBankName());
        profile.setIfscCode(dto.getIfscCode());

        return dealerRepository.save(profile);
    }

    public DealerProfile getProfileByUserId(Long userId) {
        return dealerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Dealer profile not found for userId " + userId));
    }

    public List<DealerProfile> getAllProfiles() {
        return dealerRepository.findAll();
    }

    public DealerProfile updateProfile(Long userId, DealerProfileDto dto) {
        DealerProfile profile = getProfileByUserId(userId);
        profile.setGstNumber(dto.getGstNumber());
        profile.setPanNumber(dto.getPanNumber());
        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setPincode(dto.getPincode());
        profile.setBankName(dto.getBankName());
        profile.setAccountNo(dto.getAccountNumber());
        profile.setIfscCode(dto.getIfscCode());

        return dealerRepository.save(profile);
    }

    public void deleteProfile(Long userId) {
        DealerProfile profile = getProfileByUserId(userId);
        dealerRepository.delete(profile);
    }

}
