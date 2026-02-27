package com.tesis.backend.modules.user.service;

import com.tesis.backend.modules.security.rbac.service.RoleService;
import com.tesis.backend.modules.security.rbac.repository.RoleUserRepository;
import com.tesis.backend.modules.user.dto.UserCreateRequest;
import com.tesis.backend.modules.user.dto.UserResponse;
import com.tesis.backend.modules.user.dto.UserUpdateRequest;
import com.tesis.backend.modules.user.model.AccountStatus;
import com.tesis.backend.modules.user.model.User;
import com.tesis.backend.modules.user.repository.UserRepository;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private static final String PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final RoleUserRepository roleUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository userRepository,
        RoleService roleService,
        RoleUserRepository roleUserRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.roleUserRepository = roleUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getMany() {
        List<UserResponse> response = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            response.add(toResponse(user));
        }
        return response;
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        return toResponse(getEntityById(id));
    }

    @Transactional(readOnly = true)
    public User getEntityById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> findActiveByEmail(String email) {
        return userRepository.findByEmailIgnoreCaseAndAccountStatus(email, AccountStatus.Active);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteById(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        roleUserRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo registrado");
        }

        String generatedPassword = generatePassword(12);
        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setName(request.getName().trim());
        user.setAccountStatus(request.getAccountStatus() == null ? AccountStatus.Active : request.getAccountStatus());
        user.setSalt(UUID.randomUUID().toString());
        user.setPasswordHash(passwordEncoder.encode(generatedPassword));
        user.setMeta(request.getMeta() == null ? new HashMap<>() : new HashMap<>(request.getMeta()));
        user = userRepository.save(user);

        roleService.setUserRoles(user.getId(), request.getRoles());

        UserResponse response = toResponse(user);
        Map<String, Object> meta = response.getMeta() == null ? new HashMap<>() : new HashMap<>(response.getMeta());
        meta.put("password", generatedPassword);
        response.setMeta(meta);
        return response;
    }

    @Transactional
    public UserResponse update(UUID id, UserUpdateRequest request) {
        User user = getEntityById(id);

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String normalizedEmail = request.getEmail().trim().toLowerCase();
            Optional<User> userByEmail = userRepository.findByEmailIgnoreCase(normalizedEmail);
            if (userByEmail.isPresent() && !userByEmail.get().getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo registrado");
            }
            user.setEmail(normalizedEmail);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }

        if (request.getAccountStatus() != null) {
            user.setAccountStatus(request.getAccountStatus());
        }

        if (request.getMeta() != null) {
            user.setMeta(new HashMap<>(request.getMeta()));
        }

        user = userRepository.save(user);

        if (request.getRoles() != null) {
            roleService.setUserRoles(user.getId(), request.getRoles());
        }

        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setAccountStatus(user.getAccountStatus());
        response.setMeta(user.getMeta());
        response.setRoles(roleService.getAllUserRoles(user.getId()));
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }

    private String generatePassword(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(PASSWORD_ALPHABET.charAt(RANDOM.nextInt(PASSWORD_ALPHABET.length())));
        }
        return builder.toString();
    }
}
