package com.tesis.backend.modules.security.rbac.repository;

import com.tesis.backend.modules.security.rbac.model.RoleUser;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleUserRepository extends JpaRepository<RoleUser, UUID> {

    List<RoleUser> findAllByUserId(UUID userId);

    boolean existsByUserIdAndRoleName(UUID userId, String roleName);

    void deleteByUserId(UUID userId);
}

