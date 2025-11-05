package com.erp.crm.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.crm.config.ApiResponse;
import com.erp.crm.dto.CustomerDTO;
import com.erp.crm.models.Customer;
import com.erp.crm.repositories.CustomerRepository;
import com.erp.crm.services.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerRepository customerRepo;

    public CustomerController(CustomerService customerService,CustomerRepository customerRepo){
        this.customerService = customerService;
        this.customerRepo = customerRepo;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomer(){
        return ResponseEntity.ok(customerService.getAllCustomer());
    }
    
    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getCustomerById(customerId));
    }

    @GetMapping("/name/{customerName}")
    public ResponseEntity<List<Customer>> getCustomerByName(@PathVariable String customerName) {
        return ResponseEntity.ok(customerService.getCustomerByName(customerName));
    }
    
    @PostMapping("/create-customer")
    public ResponseEntity<Customer> createCustomer(@RequestBody CustomerDTO dto){
       return ResponseEntity.ok(customerService.createCustomer(dto));
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long customerId, @RequestBody CustomerDTO dto){
        return ResponseEntity.ok(customerService.updateCustomer(customerId, dto));
    }

    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long customerId) {
        customerService.deleteCustomer(customerId);
        ApiResponse<Void> response = new ApiResponse<Void>(true, "Customer deleted successfully", null);
        return ResponseEntity.ok(response);
    } 

    @PostMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email){
        Optional<Customer> customer = customerRepo.findByEmail(email);
        return ResponseEntity.ok(customer == null);
    }
}
