// package com.erp.crm.controllers;

// import com.erp.crm.dto.LoginRequestDTO;
// import com.erp.crm.security.JwtUtils;

// import java.util.Map;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.*;

// import jakarta.validation.Valid;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//     private final AuthenticationManager authenticationManager;
//     private final JwtUtils jwtUtils;

//     public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
//         this.authenticationManager = authenticationManager;
//         this.jwtUtils = jwtUtils;
//     }

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO dto) {
//         try {
//             Authentication auth = authenticationManager.authenticate(
//                     new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));

//             UserDetails userDetails = (UserDetails) auth.getPrincipal();
//             String role = userDetails.getAuthorities().iterator().next().getAuthority();
//             if (role.startsWith("ROLE_")) {
//                 role = role.substring(5); // strip prefix
//             }

//             String token = jwtUtils.generateToken(dto.getEmail(), role);

//             return ResponseEntity.ok(Map.of(
//                     "token", token,
//                     "role", role,
//                     "username", dto.getEmail()));

//         } catch (AuthenticationException e) {
//             return ResponseEntity.status(401).body("Invalid email or password");
//         }
//     }

// }


package com.erp.crm.controllers;

import com.erp.crm.dto.LoginRequestDTO;
import com.erp.crm.models.User;
import com.erp.crm.repositories.UserRepository;
import com.erp.crm.security.JwtUtils;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO dto) {

        // Step 1: Check if user exists
        Optional<User> optionalUser = userRepository.findByEmail(dto.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "status", "error",
                    "message", "No account found with this email."
            ));
        }

        User user = optionalUser.get();

        // Optional: Check if the user is active (if you have an 'isActive' flag)
        if (!user.getIsActive()) {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", "Your account is inactive. Please contact the administrator."
            ));
        }

        try {
            // Step 2: Authenticate credentials
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            if (role.startsWith("ROLE_")) {
                role = role.substring(5);
            }

            // Step 3: Generate JWT
            String token = jwtUtils.generateToken(dto.getEmail(), role);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Login successful.",
                    "token", token,
                    "role", role,
                    "username", dto.getEmail()
            ));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of(
                    "status", "error",
                    "message", "Invalid email or password."
            ));
        }
    }
}
