package com.erp.crm.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.DealerProfile;

public interface DealerRepository extends JpaRepository<DealerProfile, Long> {
    Optional<DealerProfile> findByUserUserId(Long userId);
}
