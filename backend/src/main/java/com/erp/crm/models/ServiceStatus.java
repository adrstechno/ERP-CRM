package com.erp.crm.models;

public enum ServiceStatus {
    OPEN,           // Ticket created
    ASSIGNED,       // Assigned to an engineer
    EN_ROUTE,       // Engineer traveling to site
    ON_SITE,        // Work started
    NEED_PART,      // Waiting for part
    PART_COLLECTED, // Part acquired
    DIAGNOSING,
    FIXED,          // Issue fixed, pending check
    COMPLETED,      // Verified and closed
    CANCELLED,      // Manually cancelled
    CLOSED,           // Automatically or manually closed
    IN_PROGRESS
}
