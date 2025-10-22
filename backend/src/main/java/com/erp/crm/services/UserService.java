package com.erp.crm.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.erp.crm.dto.AdminCreateUserDTO;
import com.erp.crm.dto.LoginRequestDTO;
import com.erp.crm.dto.UserDTO;
import com.erp.crm.dto.UserResponseDTO;
import com.erp.crm.models.Role;
import com.erp.crm.models.User;
import com.erp.crm.repositories.RoleRepository;
import com.erp.crm.repositories.UserRepository;
import com.erp.crm.security.UserPrincipal;

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
        Role role = roleRepo.findByName(dto.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found : " + dto.getRole()));

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setPhone(dto.getPhone());
        user.setIsActive(true);

        return userRepo.save(user);
    }

    public User updateUser(Long userId, UserDTO dto) {
        User existingUser = getUserById(userId);
        return userRepo.save(mapDtoToEntity(existingUser, dto));
    }

    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new RuntimeException("User is already inactive");
        }
        user.setIsActive(false);
        userRepo.save(user);
    }

    public String login(LoginRequestDTO dto) {
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found by email : " + dto.getEmail()));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        return "Login successful for user: " + user.getEmail() + " with role: " + user.getRole().getName();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public List<User> getUserByName(String name) {
        return userRepo.findByName(name);
    }

    public List<User> getAllUser() {
        return userRepo.findByUserIdGreaterThanEqualOrderByUserIdDesc(2L);
    }

    public UserResponseDTO getMyUserData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String email = principal.getUsername();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Convert to DTO to avoid exposing sensitive data
        return mapToDTO(user);
    }

    public List<User> getAllUserByRole(String role) {
        return userRepo.findByRoleName(role);
    }

    public Optional<Role> getRoleByName(String roleName) {
        return roleRepo.findByName(roleName);
    }

    public User getUserById(Long userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ Profile not found for userId: " + userId));
    }

    public User mapDtoToEntity(User user, UserDTO dto) {
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // Encode password only if provided
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        user.setIsActive(dto.getIsActive());

        // Fetch role from DB
        if (dto.getRole() != null) {
            Role role = getRoleByName(dto.getRole())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + dto.getRole()));
            user.setRole(role);
        }

        user.setPhone(dto.getPhone());
        return user;
    }

    private UserResponseDTO mapToDTO(User user) {
        return new UserResponseDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPassword(),
                user.getPhone(),
                user.getIsActive());
    }

}
