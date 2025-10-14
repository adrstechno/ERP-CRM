package com.erp.crm.services;

import com.erp.crm.dto.ServiceEntitlementResponseDTO;
import com.erp.crm.models.ServiceEntitlement;
import com.erp.crm.models.Sale;
import com.erp.crm.repositories.ServiceEntitlementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceEntitlementService {

    private final ServiceEntitlementRepository serviceEntitlementRepo;

    public ServiceEntitlementService(ServiceEntitlementRepository serviceEntitlementRepo) {
        this.serviceEntitlementRepo = serviceEntitlementRepo;
    }

    // ✅ Har Sale ke Har Product ke liye 2 FREE Entitlements
    public void createServiceEntitlements(Sale sale) {
        sale.getSaleItems().forEach(item -> {
            ServiceEntitlement entitlement = new ServiceEntitlement();
            entitlement.setSale(sale);
            entitlement.setProduct(item.getProduct());
            entitlement.setEntitlementType(com.erp.crm.models.EntitlementType.FREE);
            entitlement.setTotalAllowed(2);
            entitlement.setUsedCount(0);
            entitlement.setExpiryDate(LocalDate.now().plusYears(1));
            serviceEntitlementRepo.save(entitlement);
        });
    }

    public List<ServiceEntitlementResponseDTO> getEntitlementsBySale(Long saleId) {
        return serviceEntitlementRepo.findBySale_SaleId(saleId).stream()
                .map(ServiceEntitlementResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ServiceEntitlementResponseDTO updateExpiryDate(Long entitlementId, String newExpiryDate) {
        ServiceEntitlement entitlement = serviceEntitlementRepo.findById(entitlementId)
                .orElseThrow(() -> new RuntimeException("Entitlement not found"));
        entitlement.setExpiryDate(LocalDate.parse(newExpiryDate));
        serviceEntitlementRepo.save(entitlement);
        return ServiceEntitlementResponseDTO.fromEntity(entitlement);
    }
}
