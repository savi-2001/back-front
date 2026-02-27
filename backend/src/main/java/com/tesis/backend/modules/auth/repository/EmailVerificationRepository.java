package com.tesis.backend.modules.auth.repository;

import com.tesis.backend.modules.auth.model.EmailVerification;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, UUID> {

    Optional<EmailVerification> findByEmailIgnoreCase(String email);

    Optional<EmailVerification> findByEmailToken(String emailToken);
}

