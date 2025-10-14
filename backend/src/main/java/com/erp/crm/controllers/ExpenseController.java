package com.erp.crm.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.erp.crm.config.ApiResponse;
import com.erp.crm.dto.ExpenseRequestDTO;
import com.erp.crm.dto.ExpenseResponseDTO;
import com.erp.crm.models.Status;
import com.erp.crm.services.ExpenseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    // Create a new expense (logged-in user's ID auto-detected)

    @PostMapping("add-expense")
    public ResponseEntity<ApiResponse<ExpenseResponseDTO>> createExpense(
            @ModelAttribute ExpenseRequestDTO expenseRequest,
            @RequestParam(value = "receipt", required = false) MultipartFile receipt) {

        ExpenseResponseDTO response = expenseService.createExpense(expenseRequest, receipt);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense created successfully", response));
    }

    @GetMapping("/my-expense")
    public ResponseEntity<ApiResponse<List<ExpenseResponseDTO>>> getMyExpenses() {
        List<ExpenseResponseDTO> expenses = expenseService.getExpensesByUser();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Fetched user expenses successfully", expenses));
    }

    // Get all expenses (admin view)

    @GetMapping("/all-expense")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ExpenseResponseDTO>>> getAllExpenses() {
        List<ExpenseResponseDTO> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Fetched all expenses successfully", expenses));
    }

    // Approve or reject an expense (only logged-in user can approve)
    @PatchMapping("/{expenseId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExpenseResponseDTO>> updateExpenseStatus(
            @PathVariable Long expenseId,
            @RequestParam Status status) {

        ExpenseResponseDTO updated = expenseService.updateExpenseStatus(expenseId, status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Expense status updated successfully", updated));
    }
}
