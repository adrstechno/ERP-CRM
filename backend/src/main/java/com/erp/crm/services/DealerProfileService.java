package com.erp.crm.services;

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
        User user = userRepository.findById(dto.getUserId()).orElseThrow(()-> new RuntimeException("User not found" + dto.getUserId()));

        if(dealerRepository.findByUserId(user.getUserId()).isPresent()){
            throw new RuntimeException("Profile already exists for user id : " + dto.getUserId());
        }

        DealerProfile profile = new DealerProfile();
        profile.setUser(user);
    }
    
}
