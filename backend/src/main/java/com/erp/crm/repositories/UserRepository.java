package com.erp.crm.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.erp.crm.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByName(String name);

    List<User> findByUserIdGreaterThanEqualOrderByUserIdDesc(Long id);

    List<User> findByRoleName(String roleName);

    @Query("SELECT u.role.name, COUNT(u) FROM User u GROUP BY u.role.name")
    List<Object[]> getUserCountByRole();

    @Query("SELECT u.role.name, COUNT(u) FROM User u WHERE u.isActive = true GROUP BY u.role.name")
    List<Object[]> getActiveUserCountByRole();
}
