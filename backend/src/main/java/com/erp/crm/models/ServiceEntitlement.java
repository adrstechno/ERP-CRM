package com.erp.crm.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "service_entitlements")
@Getter
@Setter
public class ServiceEntitlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceEntitlementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntitlementType entitlementType;  // FREE or PAID

    @Column(nullable = false)
    private Integer totalAllowed = 2;  // Default 2 free services

    @Column(nullable = false)
    private Integer usedCount = 0;

    @Column(nullable = false)
    private LocalDate expiryDate;

    // 🔹 Helper methods
    public boolean canUseService() {
        return usedCount < totalAllowed &&
               LocalDate.now().isBefore(expiryDate);
    }

    public void useService() {
        if (!canUseService()) {
            throw new RuntimeException("No free services remaining or expired");
        }
        this.usedCount++;
    }
}
