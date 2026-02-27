package com.tesis.backend.modules.security.rbac.service;

import com.tesis.backend.modules.security.rbac.model.Role;
import com.tesis.backend.modules.security.rbac.model.RoleUser;
import com.tesis.backend.modules.security.rbac.repository.RoleRepository;
import com.tesis.backend.modules.security.rbac.repository.RoleUserRepository;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleService {

    public static final String ROLE_PUBLIC = "public";
    public static final String ROLE_AUTH = "auth";
    public static final String ROLE_ADMIN = "admin";

    private final RoleRepository roleRepository;
    private final RoleUserRepository roleUserRepository;

    public RoleService(RoleRepository roleRepository, RoleUserRepository roleUserRepository) {
        this.roleRepository = roleRepository;
        this.roleUserRepository = roleUserRepository;
    }

    @Transactional(readOnly = true)
    public List<String> getAllUserRoles(UUID userId) {
        Set<String> roles = new LinkedHashSet<>();
        roles.add(ROLE_PUBLIC);

        List<RoleUser> userRoles = roleUserRepository.findAllByUserId(userId);
        ArrayDeque<String> queue = new ArrayDeque<>();
        for (RoleUser userRole : userRoles) {
            if (userRole.getRoleName() != null && !userRole.getRoleName().isBlank()) {
                queue.add(normalize(userRole.getRoleName()));
            }
        }

        while (!queue.isEmpty()) {
            String roleName = queue.poll();
            if (!roles.add(roleName)) {
                continue;
            }
            Optional<Role> role = roleRepository.findByNameIgnoreCase(roleName);
            if (role.isPresent() && role.get().getParentName() != null && !role.get().getParentName().isBlank()) {
                queue.add(normalize(role.get().getParentName()));
            }
        }

        return new ArrayList<>(roles);
    }

    @Transactional(readOnly = true)
    public boolean isAdmin(UUID userId) {
        return getAllUserRoles(userId).contains(ROLE_ADMIN);
    }

    @Transactional
    public void setUserRoles(UUID userId, List<String> roles) {
        roleUserRepository.deleteByUserId(userId);

        if (roles == null || roles.isEmpty()) {
            assignRoleIfMissing(userId, ROLE_AUTH);
            return;
        }

        Set<String> uniqueRoles = new LinkedHashSet<>();
        for (String role : roles) {
            if (role != null && !role.isBlank()) {
                uniqueRoles.add(normalize(role));
            }
        }

        if (uniqueRoles.isEmpty()) {
            uniqueRoles.add(ROLE_AUTH);
        }

        for (String roleName : uniqueRoles) {
            ensureRoleExists(roleName);
            RoleUser roleUser = new RoleUser();
            roleUser.setUserId(userId);
            roleUser.setRoleName(roleName);
            roleUserRepository.save(roleUser);
        }
    }

    @Transactional
    public void assignRoleIfMissing(UUID userId, String roleName) {
        String normalizedRole = normalize(roleName);
        ensureRoleExists(normalizedRole);
        if (!roleUserRepository.existsByUserIdAndRoleName(userId, normalizedRole)) {
            RoleUser roleUser = new RoleUser();
            roleUser.setUserId(userId);
            roleUser.setRoleName(normalizedRole);
            roleUserRepository.save(roleUser);
        }
    }

    @Transactional
    public void ensureBaseRoles() {
        ensureRoleExists(ROLE_PUBLIC);
        ensureRoleExists(ROLE_AUTH);
        ensureRoleExists(ROLE_ADMIN);

        setParentIfNeeded(ROLE_AUTH, ROLE_PUBLIC);
        setParentIfNeeded(ROLE_ADMIN, ROLE_AUTH);
    }

    @Transactional
    public void ensureRoleExists(String roleName) {
        String normalizedRole = normalize(roleName);
        if (roleRepository.existsByNameIgnoreCase(normalizedRole)) {
            return;
        }
        Role role = new Role();
        role.setName(normalizedRole);
        roleRepository.save(role);
    }

    private void setParentIfNeeded(String roleName, String parentName) {
        Optional<Role> roleOpt = roleRepository.findByNameIgnoreCase(roleName);
        if (roleOpt.isEmpty()) {
            return;
        }
        Role role = roleOpt.get();
        if (!Objects.equals(normalizeNullable(role.getParentName()), normalizeNullable(parentName))) {
            role.setParentName(parentName);
            roleRepository.save(role);
        }
    }

    private String normalize(String value) {
        return value.toLowerCase(Locale.ROOT).trim();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }
        return normalize(value);
    }
}

