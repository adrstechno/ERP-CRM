package com.erp.crm.config;

import com.erp.crm.models.Role;
import com.erp.crm.models.User;
import com.erp.crm.repositories.RoleRepository;
import com.erp.crm.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

            String adminEmail = System.getenv().get("ADMIN_EMAIL");
            String adminPassword = System.getenv().get("ADMIN_PASSWORD");

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setName("admin");
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(adminRole);
                userRepository.save(admin);
                System.out.println("Default admin created: email=" + adminEmail + ", password=" + adminPassword);
            }
        };
    }
}
