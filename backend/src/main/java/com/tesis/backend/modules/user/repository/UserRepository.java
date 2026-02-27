package com.tesis.backend.modules.user.repository;

import com.tesis.backend.modules.user.model.AccountStatus;
import com.tesis.backend.modules.user.model.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByEmailIgnoreCaseAndAccountStatus(String email, AccountStatus accountStatus);

    boolean existsByEmailIgnoreCase(String email);
}

