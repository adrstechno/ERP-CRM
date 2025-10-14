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
    @Column(name = "entitlement_id")
    private Long serviceEntitlementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // Each product has its own entitlement

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntitlementType entitlementType = EntitlementType.FREE; // Always starts as FREE

    @Column(nullable = false)
    private Integer totalAllowed = 2; // 2 Free services per product

    @Column(nullable = false)
    private Integer usedCount = 0;

    @Column(nullable = false)
    private LocalDate expiryDate = LocalDate.now().plusYears(1);

    public boolean canUseService() {
        return usedCount < totalAllowed && LocalDate.now().isBefore(expiryDate);
    }

    public void useService() {
        if (!canUseService()) {
            throw new RuntimeException("No free services remaining or entitlement expired.");
        }
        this.usedCount++;
    }
}
