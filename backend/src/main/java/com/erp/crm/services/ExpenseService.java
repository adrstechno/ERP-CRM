package com.erp.crm.services;

import org.springframework.stereotype.Service;

import com.erp.crm.repositories.ExpenseRepository;
import com.erp.crm.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;
    private final FileUploadService fileUploadService;

    
}
