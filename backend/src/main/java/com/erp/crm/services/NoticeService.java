package com.erp.crm.services;

import com.erp.crm.dto.NoticeRequestDTO;
import com.erp.crm.dto.NoticeResponseDTO;
import com.erp.crm.models.Notice;
import com.erp.crm.models.User;
import com.erp.crm.repositories.NoticeRepository;
import com.erp.crm.repositories.UserRepository;
import com.erp.crm.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepo;
    private final UserRepository userRepo;

    public NoticeResponseDTO createNotice(NoticeRequestDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new RuntimeException("User not authenticated");
        }

        String email = principal.getUsername();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Notice notice = new Notice();
        notice.setTitle(dto.getTitle());
        notice.setMessage(dto.getMessage());
        notice.setCreatedBy(user);

        if (dto.getTargetUserId() != null) {
            User targetUser = userRepo.findById(dto.getTargetUserId())
                    .orElseThrow(() -> new RuntimeException("Target user not found"));
            notice.setTargetUser(targetUser);
            notice.setIsGlobal(false);
        } else {
            notice.setIsGlobal(true);
        }

        return mapToDto(noticeRepo.save(notice));
    }

    @Transactional(readOnly = true)
    public List<NoticeResponseDTO> getNoticesForUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notice> notices = noticeRepo.findByIsGlobalTrueOrderByCreatedAtDesc();
        notices.addAll(noticeRepo.findByTargetUserOrderByCreatedAtDesc(user));

        return notices.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoticeResponseDTO> getAllNotices() {
        return noticeRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private NoticeResponseDTO mapToDto(Notice notice) {
        NoticeResponseDTO dto = new NoticeResponseDTO();
        dto.setNoticeId(notice.getNoticeId());
        dto.setTitle(notice.getTitle());
        dto.setMessage(notice.getMessage());
        dto.setCreatedAt(notice.getCreatedAt());
        dto.setCreatedBy(notice.getCreatedBy().getName());
        dto.setIsGlobal(notice.getIsGlobal());
        dto.setTargetUser(notice.getTargetUser() != null ? notice.getTargetUser().getName() : "All Users");
        return dto;
    }
}
