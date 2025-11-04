package com.erp.crm.services;

import com.erp.crm.models.Sale;
import com.erp.crm.models.Payment;
import com.erp.crm.models.Customer;
import com.erp.crm.repositories.SaleRepository;
import com.erp.crm.repositories.PaymentRepository;
import com.erp.crm.repositories.CustomerRepository;
import com.erp.crm.security.UserPrincipal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarketerService {

    private final SaleRepository saleRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;

    public MarketerService(SaleRepository saleRepository, 
                          PaymentRepository paymentRepository,
                          CustomerRepository customerRepository) {
        this.saleRepository = saleRepository;
        this.paymentRepository = paymentRepository;
        this.customerRepository = customerRepository;
    }

    // Get comprehensive marketer statistics
    public Map<String, Object> getMarketerStatistics() {
        Map<String, Object> stats = new LinkedHashMap<>();
        
        try {
            // Get all sales and payments
            List<Sale> allSales = saleRepository.findAll();
            List<Payment> allPayments = paymentRepository.findAll();
            List<Customer> allCustomers = customerRepository.findAll();
            
            System.out.println("MarketerService - Found " + allSales.size() + " sales, " + 
                             allPayments.size() + " payments, " + allCustomers.size() + " customers");
        
        // Calculate totals
        double totalSalesAmount = allSales.stream()
            .mapToDouble(Sale::getTotalAmount)
            .sum();
        
        double totalPaymentsAmount = allPayments.stream()
            .filter(p -> PaymentStatus.APPROVED.equals(p.getStatus()))
            .mapToDouble(Payment::getAmount)
            .sum();
        
        double outstandingAmount = totalSalesAmount - totalPaymentsAmount;
        
        // This month's data
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now();
        
        long thisMonthSales = allSales.stream()
            .filter(s -> s.getSaleDate() != null && 
                        !s.getSaleDate().isBefore(startOfMonth) && 
                        !s.getSaleDate().isAfter(endOfMonth))
            .count();
        
        long thisMonthCustomers = allCustomers.stream()
            .filter(c -> c.getCreatedAt() != null &&
                        !c.getCreatedAt().isBefore(startOfMonth.atStartOfDay()) &&
                        !c.getCreatedAt().isAfter(endOfMonth.atTime(23, 59, 59)))
            .count();
        
        // Calculate conversion rate (payments/sales)
        double conversionRate = allSales.size() > 0 ? 
            (allPayments.stream().filter(p -> PaymentStatus.APPROVED.equals(p.getStatus())).count() * 100.0 / allSales.size()) : 0;
        
            stats.put("totalSales", Math.round(totalSalesAmount));
            stats.put("totalPayments", Math.round(totalPaymentsAmount));
            stats.put("outstandingAmount", Math.round(outstandingAmount));
            stats.put("thisMonthSales", thisMonthSales);
            stats.put("thisMonthCustomers", thisMonthCustomers);
            stats.put("conversionRate", Math.round(conversionRate * 100.0) / 100.0);
            stats.put("totalCustomers", allCustomers.size());
            stats.put("totalSalesCount", allSales.size());
            
            System.out.println("MarketerService - Returning stats: " + stats);
            return stats;
        } catch (Exception e) {
            System.err.println("MarketerService - Error getting statistics: " + e.getMessage());
            e.printStackTrace();
            
            // Return default stats in case of error
            stats.put("totalSales", 0);
            stats.put("totalPayments", 0);
            stats.put("outstandingAmount", 0);
            stats.put("thisMonthSales", 0L);
            stats.put("thisMonthCustomers", 0L);
            stats.put("conversionRate", 0.0);
            stats.put("totalCustomers", 0);
            stats.put("totalSalesCount", 0);
            return stats;
        }
    }

    // Get monthly sales vs payments comparison for last 12 months
    public List<Map<String, Object>> getMonthlySalesVsPayments() {
        LocalDate startDate = LocalDate.now().minusMonths(11).withDayOfMonth(1);
        LocalDate endDate = LocalDate.now();
        
        List<Sale> sales = saleRepository.findBySaleDateBetween(startDate, endDate);
        List<Payment> payments = paymentRepository.findByPaymentDateBetween(startDate, endDate);
        
        // Group sales by month
        Map<String, Double> monthlySales = sales.stream()
            .filter(s -> s.getSaleDate() != null)
            .collect(Collectors.groupingBy(
                s -> s.getSaleDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                LinkedHashMap::new,
                Collectors.summingDouble(Sale::getTotalAmount)
            ));
        
        // Group payments by month (only approved)
        Map<String, Double> monthlyPayments = payments.stream()
            .filter(p -> PaymentStatus.APPROVED.equals(p.getStatus()) && p.getPaymentDate() != null)
            .collect(Collectors.groupingBy(
                p -> p.getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                LinkedHashMap::new,
                Collectors.summingDouble(Payment::getAmount)
            ));
        
        // Create result for last 12 months
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            YearMonth month = YearMonth.now().minusMonths(i);
            String monthKey = month.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            
            Map<String, Object> monthData = new LinkedHashMap<>();
            monthData.put("month", month.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            monthData.put("sales", Math.round(monthlySales.getOrDefault(monthKey, 0.0)));
            monthData.put("payments", Math.round(monthlyPayments.getOrDefault(monthKey, 0.0)));
            monthData.put("outstanding", Math.round(monthlySales.getOrDefault(monthKey, 0.0) - monthlyPayments.getOrDefault(monthKey, 0.0)));
            
            result.add(monthData);
        }
        
        return result;
    }

    // Get product category performance
    public List<Map<String, Object>> getCategoryPerformance() {
        List<Sale> allSales = saleRepository.findAll();
        
        // Group by product category and calculate totals
        Map<String, Map<String, Object>> categoryStats = new LinkedHashMap<>();
        
        for (Sale sale : allSales) {
            if (sale.getSaleItems() != null) {
                for (var item : sale.getSaleItems()) {
                    if (item.getProduct() != null && item.getProduct().getCategory() != null) {
                        String category = item.getProduct().getCategory().getCategoryName();
                        
                        categoryStats.computeIfAbsent(category, k -> {
                            Map<String, Object> stats = new LinkedHashMap<>();
                            stats.put("category", k);
                            stats.put("totalSales", 0.0);
                            stats.put("totalQuantity", 0);
                            stats.put("salesCount", 0);
                            return stats;
                        });
                        
                        Map<String, Object> stats = categoryStats.get(category);
                        stats.put("totalSales", (Double) stats.get("totalSales") + (item.getUnitPrice() * item.getQuantity()));
                        stats.put("totalQuantity", (Integer) stats.get("totalQuantity") + item.getQuantity());
                        stats.put("salesCount", (Integer) stats.get("salesCount") + 1);
                    }
                }
            }
        }
        
        // Convert to list and round values
        return categoryStats.values().stream()
            .map(stats -> {
                Map<String, Object> result = new LinkedHashMap<>(stats);
                result.put("totalSales", Math.round((Double) stats.get("totalSales")));
                return result;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("totalSales"), (Double) a.get("totalSales")))
            .collect(Collectors.toList());
    }

    // Get recent sales (last 10)
    public List<Map<String, Object>> getRecentSales() {
        List<Sale> recentSales = saleRepository.findTop10ByOrderBySaleDateDesc();
        
        return recentSales.stream()
            .map(sale -> {
                Map<String, Object> saleData = new LinkedHashMap<>();
                saleData.put("saleId", sale.getSaleId());
                saleData.put("customerName", sale.getCustomer() != null ? 
                    sale.getCustomer().getCustomerName() : "Unknown Customer");
                saleData.put("totalAmount", Math.round(sale.getTotalAmount()));
                saleData.put("saleDate", sale.getSaleDate() != null ? 
                    sale.getSaleDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "N/A");
                saleData.put("itemCount", sale.getSaleItems() != null ? sale.getSaleItems().size() : 0);
                return saleData;
            })
            .collect(Collectors.toList());
    }

    // Get customer acquisition trends (last 12 months)
    public List<Map<String, Object>> getCustomerAcquisitionTrends() {
        try {
            LocalDateTime startDate = LocalDate.now().minusMonths(11).withDayOfMonth(1).atStartOfDay();
            LocalDateTime endDate = LocalDate.now().atTime(23, 59, 59);
            
            List<Customer> customers = customerRepository.findByCreatedAtBetween(startDate, endDate);
            
            // Group customers by month
            Map<String, Long> monthlyCustomers = customers.stream()
                .filter(c -> c.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                    c -> c.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                    LinkedHashMap::new,
                    Collectors.counting()
                ));
            
            // Create result for last 12 months
            List<Map<String, Object>> result = new ArrayList<>();
            for (int i = 11; i >= 0; i--) {
                YearMonth month = YearMonth.now().minusMonths(i);
                String monthKey = month.format(DateTimeFormatter.ofPattern("yyyy-MM"));
                
                Map<String, Object> monthData = new LinkedHashMap<>();
                monthData.put("month", month.format(DateTimeFormatter.ofPattern("MMM")));
                monthData.put("newCustomers", monthlyCustomers.getOrDefault(monthKey, 0L));
                
                result.add(monthData);
            }
            
            return result;
        } catch (Exception e) {
            // Return empty result if there's an issue (e.g., createdAt field doesn't exist yet)
            List<Map<String, Object>> result = new ArrayList<>();
            for (int i = 11; i >= 0; i--) {
                YearMonth month = YearMonth.now().minusMonths(i);
                Map<String, Object> monthData = new LinkedHashMap<>();
                monthData.put("month", month.format(DateTimeFormatter.ofPattern("MMM")));
                monthData.put("newCustomers", 0L);
                result.add(monthData);
            }
            return result;
        }
    }
}