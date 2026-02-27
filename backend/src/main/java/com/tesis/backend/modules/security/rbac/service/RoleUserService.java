package com.tesis.backend.modules.security.rbac.service;

import com.tesis.backend.modules.security.rbac.model.RoleUser;
import com.tesis.backend.modules.security.rbac.repository.RoleUserRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleUserService {

    private final RoleUserRepository roleUserRepository;

    public RoleUserService(RoleUserRepository roleUserRepository) {
        this.roleUserRepository = roleUserRepository;
    }

    @Transactional(readOnly = true)
    public List<RoleUser> findByUserId(UUID userId) {
        return roleUserRepository.findAllByUserId(userId);
    }
}

