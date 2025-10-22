package com.erp.crm.services;

import java.time.LocalDate;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.dto.CategorySalesDTO;
import com.erp.crm.dto.DashboardResponseDTO;
import com.erp.crm.dto.ProductStatsDTO;
import com.erp.crm.dto.UserStatsDTO;
import com.erp.crm.repositories.ExpenseRepository;
import com.erp.crm.repositories.PaymentRepository;
import com.erp.crm.repositories.SaleRepository;
import com.erp.crm.repositories.UserRepository;

@Service
@Transactional
public class DashboardService {

    private final SaleRepository saleRepo;
    private final PaymentRepository paymentRepo;
    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;

    public DashboardService(SaleRepository saleRepo, PaymentRepository paymentRepo, ExpenseRepository expenseRepo, UserRepository userRepo) {
        this.saleRepo = saleRepo;
        this.paymentRepo = paymentRepo;
        this.expenseRepo = expenseRepo;
        this.userRepo = userRepo;
    }

    public DashboardResponseDTO getDashboard(LocalDate start, LocalDate end, int topProductsLimit) {
        DashboardResponseDTO dto = new DashboardResponseDTO();
        dto.setTotalSales(saleRepo.getTotalSales(start, end));
        dto.setTotalPayments(paymentRepo.getTotalPayments(start, end));
        dto.setOutstandingPayments(paymentRepo.getOutstandingPayments(start, end));
        dto.setTotalExpenses(expenseRepo.getTotalExpenses(start, end));

        // Top products
        dto.setTopProducts(
            saleRepo.getTopProducts(PageRequest.of(0, topProductsLimit))
                .stream()
                .map(obj -> {
                    ProductStatsDTO ps = new ProductStatsDTO();
                    ps.setProductId((Long)obj[0]);
                    ps.setProductName((String)obj[1]);
                    ps.setQuantitySold((Long)obj[2]);
                    ps.setRevenue((Double)obj[3]);
                    return ps;
                }).toList()
        );

        // Sales by category
        dto.setSalesByCategory(
            saleRepo.getSalesByCategory(start, end)
                .stream()
                .map(obj -> {
                    CategorySalesDTO cs = new CategorySalesDTO();
                    cs.setCategory((String)obj[0]);
                    cs.setTotalRevenue((Double)obj[1]);
                    return cs;
                }).toList()
        );

        // Users stats
        dto.setUserStats(
            userRepo.getUserCountByRole().stream()
                .map(obj -> {
                    UserStatsDTO us = new UserStatsDTO();
                    us.setRole((String)obj[0]);
                    us.setTotalUsers((Long)obj[1]);
                    return us;
                }).toList()
        );

        return dto;
    }
}
