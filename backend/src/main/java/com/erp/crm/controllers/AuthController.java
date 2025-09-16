package com.erp.crm.controllers;

import com.erp.crm.dto.LoginRequestDTO;
import com.erp.crm.security.JwtUtils;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO dto) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            if (role.startsWith("ROLE_")) {
                role = role.substring(5); // strip prefix
            }

            String token = jwtUtils.generateToken(dto.getEmail(), role);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", role,
                    "username", dto.getEmail()));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

}
