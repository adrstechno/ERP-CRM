package com.erp.crm.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erp.crm.models.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Optional<Expense> findByUser_userId(Long userId);
}
