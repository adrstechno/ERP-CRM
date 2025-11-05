package com.erp.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erp.crm.dto.CustomerDTO;
import com.erp.crm.models.Customer;
import com.erp.crm.repositories.CustomerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepo;


    @Transactional
    public Customer createCustomer(CustomerDTO dto){
        Customer customer = new Customer();
        return customerRepo.save(dtoEntityMapping(customer,dto));
    }

    public Customer updateCustomer(Long customerId,CustomerDTO dto){
        Customer existingCustomer = getCustomerById(customerId);
        return customerRepo.save(dtoEntityMapping(existingCustomer,dto));
    }

    public void deleteCustomer(Long customerId){
        Customer customer = getCustomerById(customerId);
        customerRepo.delete(customer);
    }

    public List<Customer> getAllCustomer(){
        return customerRepo.findAll();
    }

    public Customer dtoEntityMapping(Customer customer ,CustomerDTO dto){
        customer.setCustomerName(dto.getCustomerName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        customer.setAddress(dto.getAddress());
        return customer;
    }

    public Customer getCustomerById(Long customerId) {
        return customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("❌ Customer not found for Customer Id : " + customerId));
    }

    public List<Customer> getCustomerByName(String customerName){
        // Use partial search for better user experience
        return customerRepo.findByCustomerNameContainingIgnoreCase(customerName);
    }

    
}
