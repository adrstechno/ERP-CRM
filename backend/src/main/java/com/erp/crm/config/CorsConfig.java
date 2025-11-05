package com.erp.crm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:5173",  // Vite dev server
                        "http://localhost:4173",  // Vite preview
                        "https://erp-crm-hua2.onrender.com",  // Production URL
                        "https://erp-crm-iota.vercel.app"     // Vercel URL
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization")
                    .allowCredentials(true)
                    .maxAge(3600); // Cache preflight requests for 1 hour
            }
        };
    }
}
