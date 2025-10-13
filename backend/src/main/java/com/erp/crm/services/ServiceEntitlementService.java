package com.erp.crm.services;

import com.erp.crm.dto.ServiceEntitlementResponseDTO;
import com.erp.crm.models.ServiceEntitlement;
import com.erp.crm.repositories.ServiceEntitlementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceEntitlementService {

    private final ServiceEntitlementRepository entitlementRepo;

    public ServiceEntitlementService(ServiceEntitlementRepository entitlementRepo) {
        this.entitlementRepo = entitlementRepo;
    }

    // 1️⃣ Get entitlements by Sale
    public List<ServiceEntitlementResponseDTO> getEntitlementsBySale(Long saleId) {
        List<ServiceEntitlement> entitlements = entitlementRepo.findAllBySale_SaleId(saleId);
        return entitlements.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Helper method → Entity to DTO
    private ServiceEntitlementResponseDTO mapToDto(ServiceEntitlement entitlement) {
        ServiceEntitlementResponseDTO dto = new ServiceEntitlementResponseDTO();
        dto.setEntitlementId(entitlement.getServiceEntitlementId());
        dto.setCustomerName(
                entitlement.getSale().getCustomer().getCustomerName());

        dto.setEntitlementType(entitlement.getEntitlementType());
        dto.setTotalAllowed(entitlement.getTotalAllowed());
        dto.setUsedCount(entitlement.getUsedCount());
        dto.setExpiryDate(entitlement.getExpiryDate());
        return dto;
    }

    @Transactional
    public ServiceEntitlementResponseDTO updateExpiryDate(Long entitlementId, String newExpiryDateStr) {
        ServiceEntitlement entitlement = entitlementRepo.findById(entitlementId)
                .orElseThrow(() -> new RuntimeException("Entitlement not found with id: " + entitlementId));

        LocalDate newExpiryDate;
        try {
            newExpiryDate = LocalDate.parse(newExpiryDateStr); // yyyy-MM-dd
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Use yyyy-MM-dd.");
        }

        entitlement.setExpiryDate(newExpiryDate);
        ServiceEntitlement saved = entitlementRepo.save(entitlement);

        return mapToDto(saved);
    }

}
