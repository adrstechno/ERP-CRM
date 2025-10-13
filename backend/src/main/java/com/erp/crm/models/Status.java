package com.erp.crm.models;



public enum Status {
    ACTIVE,          // For users, clinics, or active entities
    INACTIVE,        // Soft-deleted or temporarily disabled
    PENDING,         // Waiting for approval or processing
    APPROVED,        // Approved by admin or manager
    REJECTED,        // Rejected during validation
    COMPLETED,       // Finished workflow (like sale or expense)
    CANCELLED ,
    OPEN, 
    IN_PROGRESS, 
    RESOLVED, 
    CLOSED     // Cancelled by user or admin
}
