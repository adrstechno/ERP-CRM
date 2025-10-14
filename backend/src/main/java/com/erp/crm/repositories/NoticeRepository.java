package com.erp.crm.repositories;

import com.erp.crm.models.Notice;
import com.erp.crm.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByIsGlobalTrueOrderByCreatedAtDesc();
    List<Notice> findByTargetUserOrderByCreatedAtDesc(User user);
}
