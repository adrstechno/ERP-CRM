package com.erp.crm.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.erp.crm.dto.ExpenseRequestDTO;
import com.erp.crm.dto.ExpenseResponseDTO;
import com.erp.crm.models.Expense;
import com.erp.crm.models.Status;
import com.erp.crm.models.User;
import com.erp.crm.repositories.ExpenseRepository;
import com.erp.crm.repositories.UserRepository;
import com.erp.crm.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;
    private final FileUploadService fileUploadService;

    // Create new expense ( authenticated user)
    public ExpenseResponseDTO createExpense(ExpenseRequestDTO dto, MultipartFile receipt) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setAmount(dto.getAmount());
        expense.setRemarks(dto.getRemarks());
        expense.setCategory(dto.getCategory());
        expense.setExpenseDate(LocalDate.now()); // Auto-set date
        expense.setStatus(Status.PENDING);

        if (receipt != null && !receipt.isEmpty()) {
            String uploadedUrl = fileUploadService.uploadReceipt(receipt, null);
            expense.setReceiptURL(uploadedUrl);
        }

        Expense saved = expenseRepo.save(expense);
        return mapToDto(saved);
    }

    // Approve or update expense status
    @Transactional
    public ExpenseResponseDTO updateExpenseStatus(Long expenseId, Status status) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        // Get approver (logged-in user)
        String email = principal.getUsername();
        User approver = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Approver not found with email: " + email));

        // Find expense record
        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + expenseId));

        // Update fields
        expense.setApprovedBy(approver);
        expense.setStatus(status);

        Expense updated = expenseRepo.save(expense);
        return mapToDto(updated);
    }

    // Get expenses of the authenticated user
    @Transactional(readOnly = true)

    public List<ExpenseResponseDTO> getExpensesByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<Expense> expenses = expenseRepo.findAllByUser_userId(user.getUserId());

        return expenses.stream()
                .map(this::mapToDto)
                .toList();
    }

    // Get all expenses (admin use)
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getAllExpenses() {
        return expenseRepo.findAllByOrderByExpenseIdDesc()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // Map Expense → DTO
    private ExpenseResponseDTO mapToDto(Expense expense) {
        ExpenseResponseDTO dto = new ExpenseResponseDTO();
        dto.setUserName(expense.getUser() != null ? expense.getUser().getName() : null);
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setExpenseId(expense.getExpenseId());
        dto.setCategory(expense.getCategory());
        dto.setAmount(expense.getAmount());
        dto.setRemarks(expense.getRemarks());
        dto.setStatus(expense.getStatus());
        dto.setInvoiceUrl(expense.getReceiptURL());
        dto.setApprovedBy(expense.getApprovedBy() != null ? expense.getApprovedBy().getName() : null);
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        return dto;
    }
}
