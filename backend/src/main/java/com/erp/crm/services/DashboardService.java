package com.erp.crm.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.dto.AdminDashboardResponseDTO;
import com.erp.crm.dto.DealerDashboardDTO;
import com.erp.crm.dto.DealerMonthlyTrendDTO;
import com.erp.crm.dto.MarketerDashboardDTO;
import com.erp.crm.dto.ProductStatsDTO;
import com.erp.crm.dto.UserStatsDTO;
import com.erp.crm.dto.EngineerDashboardDTO;
import com.erp.crm.dto.KpiDTO;
import com.erp.crm.dto.CategoryStatDTO;
import com.erp.crm.dto.RecentServiceDTO;
import com.erp.crm.models.ServiceReport;
import com.erp.crm.models.ServiceStatus;
import com.erp.crm.models.ServiceTicket;
import com.erp.crm.models.User;
import com.erp.crm.repositories.CustomerRepository;
import com.erp.crm.repositories.ExpenseRepository;
import com.erp.crm.repositories.PaymentRepository;
import com.erp.crm.repositories.SaleRepository;
import com.erp.crm.repositories.ServiceReportRepository;
import com.erp.crm.repositories.ServiceTicketRepository;
import com.erp.crm.repositories.StockRequestRepository;
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
    private final StockRequestRepository stockRepo;

    // For engineer dashboard
    private final ServiceTicketRepository ticketRepo;
    private final ServiceReportRepository reportRepo;

    public DashboardService(SaleRepository saleRepo, PaymentRepository paymentRepo, ExpenseRepository expenseRepo,
            UserRepository userRepo, CustomerRepository customerRepo, StockRequestRepository stockRepo,
            ServiceTicketRepository ticketRepo, ServiceReportRepository reportRepo) {
        this.saleRepo = saleRepo;
        this.paymentRepo = paymentRepo;
        this.expenseRepo = expenseRepo;
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.stockRepo = stockRepo;
        this.ticketRepo = ticketRepo;
        this.reportRepo = reportRepo;
    }

    public AdminDashboardResponseDTO getDashboard(LocalDate start, LocalDate end, int topProductsLimit) {
        AdminDashboardResponseDTO dto = new AdminDashboardResponseDTO();
        dto.setTotalSales(saleRepo.getTotalSales(start, end));
        dto.setTotalPayments(paymentRepo.getTotalPayments(start, end));
        dto.setOutstandingPayments(paymentRepo.getOutstandingPayments(start, end));
        dto.setTotalExpenses(expenseRepo.getTotalExpenses(start, end));

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
        Double totalPayments = saleRepo.getTotalPaymentsByMarketer(marketer.getUserId(), startOfYear, today);

        Double outstanding = (totalSales != null ? totalSales : 0.0) - (totalPayments != null ? totalPayments : 0.0);

        Integer thisMonthSalesCount = saleRepo.countSalesThisMonthByMarketer(marketer.getUserId(), startOfMonth, today);
        Double conversionRate = totalSales != null && totalSales > 0
                ? (totalPayments / totalSales) * 100
                : 0.0;

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
                nullToZero(activeCustomers));
    }

    public DealerDashboardDTO getDealerDashboardSummary() {
        Long dealerId = getCurrentUser().getUserId();
        Long stockApproved = stockRepo.countApprovedStockByDealer(dealerId);
        Long stockPending = stockRepo.countPendingStockByDealer(dealerId);
        Long stockRejected = stockRepo.countRejectedStockByDealer(dealerId);
        Long totalStock = stockApproved + stockPending + stockRejected;

        // Get monthly trend data for last 6 months
        List<DealerMonthlyTrendDTO> monthlyTrend = getDealerMonthlyTrend(dealerId);

        return new DealerDashboardDTO(stockApproved, stockPending, stockRejected, totalStock, monthlyTrend);
    }

    public List<DealerMonthlyTrendDTO> getDealerMonthlyTrend(Long dealerId) {
        List<DealerMonthlyTrendDTO> trendData = new ArrayList<>();
        LocalDate endDate = LocalDate.now();

        // Get last 6 months data
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);

            // Convert LocalDate to LocalDateTime for comparison
            LocalDateTime startDateTime = monthStart.atStartOfDay();
            LocalDateTime endDateTime = monthEnd.plusDays(1).atStartOfDay(); // Next day at 00:00 for exclusive end

            String monthName = monthStart.getMonth().toString().substring(0, 3);
            monthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();

            Long requested = stockRepo.countStockRequestsByDealerAndDateRange(dealerId, startDateTime, endDateTime);
            Long approved = stockRepo.countApprovedStockByDealerAndDateRange(dealerId, startDateTime, endDateTime);
            Long pending = stockRepo.countPendingStockByDealerAndDateRange(dealerId, startDateTime, endDateTime);

            trendData.add(new DealerMonthlyTrendDTO(
                    monthName,
                    requested != null ? requested : 0L,
                    approved != null ? approved : 0L,
                    pending != null ? pending : 0L));
        }

        return trendData;
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

    // ----------------- Engineer dashboard -----------------
    public EngineerDashboardDTO getEngineerDashboard() {
        User engineer = getCurrentUser();

        List<ServiceTicket> assigned = ticketRepo.findByAssignedEngineerOrderByIdDesc(engineer);

        long totalAssigned = assigned.size();

        Set<ServiceStatus> pendingStatuses = Set.of(
                ServiceStatus.OPEN,
                ServiceStatus.ASSIGNED,
                ServiceStatus.EN_ROUTE,
                ServiceStatus.ON_SITE,
                ServiceStatus.NEED_PART,
                ServiceStatus.PART_COLLECTED,
                ServiceStatus.DIAGNOSING,
                ServiceStatus.IN_PROGRESS
        );

        long pending = assigned.stream().filter(t -> pendingStatuses.contains(t.getServiceStatus())).count();
        long completed = assigned.stream().filter(t -> t.getServiceStatus() == ServiceStatus.COMPLETED || t.getServiceStatus() == ServiceStatus.CLOSED).count();

        List<KpiDTO> kpis = List.of(
                new KpiDTO("Assigned Tickets", String.valueOf(totalAssigned), "", "neutral"),
                new KpiDTO("Pending Tickets", String.valueOf(pending), "", (pending > 0 ? "down" : "neutral")),
                new KpiDTO("Completed Tickets", String.valueOf(completed), "", (completed > 0 ? "up" : "neutral"))
        );

        // Service breakdown by product category (for assigned tickets)
        Map<String, Long> byCategory = assigned.stream()
                .filter(t -> t.getProduct() != null && t.getProduct().getCategory() != null)
                .collect(Collectors.groupingBy(t -> t.getProduct().getCategory(), Collectors.counting()));

        List<CategoryStatDTO> catStats = byCategory.entrySet().stream()
                .map(e -> new CategoryStatDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(CategoryStatDTO::getValue).reversed())
                .toList();

        long total = catStats.stream().mapToLong(CategoryStatDTO::getValue).sum();

        EngineerDashboardDTO.ServiceBreakdownDTO breakdown = new EngineerDashboardDTO.ServiceBreakdownDTO(total, catStats);

        // Recent services: use reports created by engineer (most recent 5)
        DateTimeFormatter UI_DATE = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        List<RecentServiceDTO> recents = reportRepo.findAllByEngineer_UserId(getCurrentUser().getUserId()).stream()
                .sorted(Comparator.comparing(ServiceReport::getCreatedAt).reversed())
                .limit(5)
                .map(r -> new RecentServiceDTO(
                        r.getReportId(),
                        r.getCreatedAt() == null ? "" : r.getCreatedAt().format(UI_DATE),
                        r.getAdditionalCharges() == null ? 0.0 : r.getAdditionalCharges(),
                        r.getDescription()
                ))
                .toList();

        return new EngineerDashboardDTO(kpis, breakdown, recents);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal))
            throw new RuntimeException("User not authenticated");

        return userRepo.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}