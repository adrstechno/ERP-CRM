package com.erp.crm.services;

import com.erp.crm.repositories.RoleRepository;
import com.erp.crm.repositories.UserRepository;

public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    public UserService(UserRepository userRepo, RoleRepository roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }
}
