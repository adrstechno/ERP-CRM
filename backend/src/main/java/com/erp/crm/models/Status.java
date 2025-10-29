package com.erp.crm.models;



public enum Status {
    ACTIVE,          // For users, clinics, or active entities
    INACTIVE,        // Soft-deleted or temporarily disabled
    PENDING,         // Waiting for approval or processing
    APPROVED,        // Approved by admin or manager
    REJECTED,        // Rejected during validation    
}
