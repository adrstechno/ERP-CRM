package com.erp.crm.services;

import java.time.LocalDate;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.dto.AdminDashboardResponseDTO;
import com.erp.crm.dto.CategorySalesDTO;
import com.erp.crm.dto.MarketerDashboardDTO;
import com.erp.crm.dto.ProductStatsDTO;
import com.erp.crm.dto.UserStatsDTO;
import com.erp.crm.models.User;
import com.erp.crm.repositories.CustomerRepository;
import com.erp.crm.repositories.ExpenseRepository;
import com.erp.crm.repositories.PaymentRepository;
import com.erp.crm.repositories.SaleRepository;
import com.erp.crm.repositories.UserRepository;
import com.erp.crm.security.UserPrincipal;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final SaleRepository saleRepo;
    private final PaymentRepository paymentRepo;
    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;

    public DashboardService(SaleRepository saleRepo, PaymentRepository paymentRepo, ExpenseRepository expenseRepo,
            UserRepository userRepo, CustomerRepository customerRepo) {
        this.saleRepo = saleRepo;
        this.paymentRepo = paymentRepo;
        this.expenseRepo = expenseRepo;
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
    }

    public AdminDashboardResponseDTO getDashboard(LocalDate start, LocalDate end, int topProductsLimit) {
        AdminDashboardResponseDTO dto = new AdminDashboardResponseDTO();
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
                            ps.setProductId((Long) obj[0]);
                            ps.setProductName((String) obj[1]);
                            ps.setQuantitySold((Long) obj[2]);
                            ps.setRevenue((Double) obj[3]);
                            return ps;
                        }).toList());

        // Sales by category

        // Users stats
        dto.setUserStats(
                userRepo.getUserCountByRole().stream()
                        .map(obj -> {
                            UserStatsDTO us = new UserStatsDTO();
                            us.setRole((String) obj[0]);
                            us.setTotalUsers((Long) obj[1]);
                            return us;
                        }).toList());

        return dto;
    }

public MarketerDashboardDTO getMarketerDashboardSummary() {
    User marketer = getCurrentUser();
    LocalDate today = LocalDate.now();
    LocalDate startOfYear = LocalDate.of(today.getYear(), 1, 1);
    LocalDate startOfMonth = today.withDayOfMonth(1);

    Double totalSales = saleRepo.getTotalSalesByMarketer(marketer.getUserId(), startOfYear, today);
    Double totalPayments = saleRepo.getTotalPaymentsByMarketer(marketer.getUserId(), startOfYear, today); // uses PaymentRepo or via Sale?
    
    // Since Payment is linked via Invoice → Sale, we use Sale-based query above
    Double outstanding = (totalSales != null ? totalSales : 0.0) - (totalPayments != null ? totalPayments : 0.0);

    Integer thisMonthSalesCount = saleRepo.countSalesThisMonthByMarketer(marketer.getUserId(), startOfMonth, today);
    Double conversionRate = totalSales != null && totalSales > 0 
        ? (totalPayments / totalSales) * 100 : 0.0;

    Double todaySales = saleRepo.getTodaySalesByMarketer(marketer.getUserId(), today);
    Double lastSaleAmount = saleRepo.getLastSaleAmountByMarketer(marketer.getUserId());
    Integer activeCustomers = customerRepo.countActiveCustomersByMarketer(marketer.getUserId());

    return new MarketerDashboardDTO(
        nullToZero(totalSales),
        nullToZero(totalPayments),
        nullToZero(outstanding),
        nullToZero(thisMonthSalesCount),
        round2(conversionRate),
        nullToZero(todaySales),
        nullToZero(lastSaleAmount),
        nullToZero(activeCustomers)
    );
}

    private Double nullToZero(Double val) {
        return val != null ? val : 0.0;
    }

    private Integer nullToZero(Integer val) {
        return val != null ? val : 0;
    }

    private Double round2(Double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal))
            throw new RuntimeException("User not authenticated");

        return userRepo.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
