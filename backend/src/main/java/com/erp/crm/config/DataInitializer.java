package com.erp.crm.config;

import com.erp.crm.models.Role;
import com.erp.crm.models.User;
import com.erp.crm.repositories.RoleRepository;
import com.erp.crm.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
                                   RoleRepository roleRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                if (adminPassword == null || adminPassword.isBlank()) {
                    throw new IllegalStateException("Admin password must not be null/blank.");
                }

                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setName("admin");
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(adminRole);
                userRepository.save(admin);

                System.out.println("✅ Default admin created: " + adminEmail);
            }
        };
    }
}
