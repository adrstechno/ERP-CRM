package com.erp.crm.controllers;

import com.erp.crm.dto.NoticeRequestDTO;
import com.erp.crm.dto.NoticeResponseDTO;
import com.erp.crm.services.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NoticeResponseDTO> createNotice(
        
            @RequestBody NoticeRequestDTO dto) {
        return ResponseEntity.ok(noticeService.createNotice( dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NoticeResponseDTO>> getUserNotices(@PathVariable Long userId) {
        return ResponseEntity.ok(noticeService.getNoticesForUser(userId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NoticeResponseDTO>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }
}
