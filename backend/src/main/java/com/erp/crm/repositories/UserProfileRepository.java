package com.erp.crm.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.models.UserProfile;


public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserProfile up WHERE up.user.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}

