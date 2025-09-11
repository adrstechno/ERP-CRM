package com.erp.crm.services;

import java.util.Optional;

import com.erp.crm.models.Role;
import com.erp.crm.models.User;
import com.erp.crm.repositories.RoleRepository;
import com.erp.crm.repositories.UserRepository;

public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    public UserService(UserRepository userRepo, RoleRepository roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    public User createUser(User user) {
        return userRepo.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public Optional<Role> getRoleByName(String roleName) {
        return roleRepo.findByName(roleName);
    } 
}
