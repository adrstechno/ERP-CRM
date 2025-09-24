package com.erp.crm.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.erp.crm.dto.AdminCreateUserDTO;
import com.erp.crm.dto.LoginRequestDTO;
import com.erp.crm.models.Role;
import com.erp.crm.models.User;
import com.erp.crm.repositories.RoleRepository;
import com.erp.crm.repositories.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder; 

   
    public UserService(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(AdminCreateUserDTO dto) {
        Role role = roleRepo.findByName(dto.getRole()).orElseThrow(()-> new RuntimeException("Role not found : " + dto.getRole()));

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setPhone(dto.getPhone());
        user.setIsActive(true);

        return userRepo.save(user);
    }
    // update user
    // finsd by name

    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public List<User> getAllUser(){
        return userRepo.findByUserIdGreaterThanEqualOrderByUserIdDesc(2L);
    }

    public String login(LoginRequestDTO dto) {
        User user = userRepo.findByEmail(dto.getEmail()).orElseThrow(() -> 
            new RuntimeException("User not found by email : " + dto.getEmail()));

        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }

        if(!user.getIsActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        return "Login successful for user: " + user.getEmail() + " with role: " + user.getRole().getName();
    }

    public Optional<Role> getRoleByName(String roleName) {
        return roleRepo.findByName(roleName);
    } 
}
