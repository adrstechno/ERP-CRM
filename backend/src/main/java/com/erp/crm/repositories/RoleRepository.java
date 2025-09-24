package com.erp.crm.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.Role;
import com.erp.crm.models.User;

public interface RoleRepository extends JpaRepository<Role, Long>{
    Optional<Role> findByName(String name);

}
