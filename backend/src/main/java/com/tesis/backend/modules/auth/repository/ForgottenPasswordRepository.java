package com.tesis.backend.modules.auth.repository;

import com.tesis.backend.modules.auth.model.ForgottenPassword;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForgottenPasswordRepository extends JpaRepository<ForgottenPassword, UUID> {

    Optional<ForgottenPassword> findByEmailIgnoreCase(String email);

    Optional<ForgottenPassword> findByEmailIgnoreCaseAndPasswordToken(String email, String passwordToken);
}

