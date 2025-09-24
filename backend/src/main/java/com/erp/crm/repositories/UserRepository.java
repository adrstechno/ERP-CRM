package com.erp.crm.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.User;
import com.erp.crm.models.UserProfile;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByUserIdGreaterThanEqualOrderByUserIdDesc(Long id);
}
