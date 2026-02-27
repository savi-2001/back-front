package com.tesis.backend.config;

import com.tesis.backend.modules.security.rbac.service.RoleService;
import com.tesis.backend.modules.user.model.AccountStatus;
import com.tesis.backend.modules.user.model.User;
import com.tesis.backend.modules.user.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleService roleService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin-email:}")
    private String bootstrapAdminEmail;

    @Value("${app.bootstrap.admin-password:}")
    private String bootstrapAdminPassword;

    @Value("${app.bootstrap.admin-name:Admin}")
    private String bootstrapAdminName;

    public DataInitializer(RoleService roleService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleService = roleService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        roleService.ensureBaseRoles();

        if (bootstrapAdminEmail == null || bootstrapAdminEmail.isBlank() || bootstrapAdminPassword == null || bootstrapAdminPassword.isBlank()) {
            return;
        }

        String email = bootstrapAdminEmail.trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(bootstrapAdminName);
            user.setPasswordHash(passwordEncoder.encode(bootstrapAdminPassword));
            user.setSalt(UUID.randomUUID().toString());
            user.setAccountStatus(AccountStatus.Active);
            user.setMeta(new HashMap<>());
            user = userRepository.save(user);
        }

        roleService.setUserRoles(user.getId(), List.of(RoleService.ROLE_ADMIN));
    }
}

