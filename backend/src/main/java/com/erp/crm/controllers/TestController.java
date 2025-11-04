package com.erp.crm.controllers;

import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class TestController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "timestamp", java.time.LocalDateTime.now().toString());
    }
}
