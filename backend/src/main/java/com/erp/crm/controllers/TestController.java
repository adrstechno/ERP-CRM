package com.erp.crm.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class TestController {
    
    @GetMapping("/test") 
    public String test() {
        return "API is working!";
    }
}
