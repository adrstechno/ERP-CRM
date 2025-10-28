package com.erp.crm.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.dto.StockRequestDTO;
import com.erp.crm.dto.StockRequestResponseDTO;
import com.erp.crm.models.Product;
import com.erp.crm.models.Status;
import com.erp.crm.models.StockRequest;
import com.erp.crm.models.User;
import com.erp.crm.repositories.ProductRepository;
import com.erp.crm.repositories.StockRequestRepository;
import com.erp.crm.repositories.UserRepository;
import com.erp.crm.security.UserPrincipal;

import lombok.AllArgsConstructor;

@Transactional
@Service
@AllArgsConstructor
public class StockRequestService {
    private final StockRequestRepository stockRequestRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepo;

    public StockRequestResponseDTO createRequest(StockRequestDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        StockRequest request = new StockRequest();
        request.setProduct(product);
        request.setQuantity(dto.getQuantity());
        request.setNotes(dto.getNotes());
        request.setRequestedBy(user);

        StockRequest saved = stockRequestRepository.save(request);
        return mapToDto(saved);
    }

    public List<StockRequestResponseDTO> getStockRequestsByUserId(Long userId) {
        return stockRequestRepository.findByRequestedBy_UserId(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<StockRequestResponseDTO> getAllRequests() {
        return stockRequestRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<StockRequestResponseDTO> getRequestsByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return stockRequestRepository.findByRequestedBy_UserId(user.getUserId()).stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StockRequestResponseDTO updateStatus(Long requestId, Status status) {
        StockRequest request = stockRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        return mapToDto(request);
    }

    private StockRequestResponseDTO mapToDto(StockRequest request) {
        StockRequestResponseDTO dto = new StockRequestResponseDTO();
        dto.setRequestId(request.getRequestId());
        dto.setProductId(request.getProduct().getProductId());
        dto.setProductName(request.getProduct().getName());
        dto.setQuantity(request.getQuantity());
        dto.setStatus(request.getStatus().name());
        dto.setRequestedBy(request.getRequestedBy().getName());
        dto.setRequestDate(request.getRequestDate());
        dto.setNotes(request.getNotes());
        return dto;
    }

}
