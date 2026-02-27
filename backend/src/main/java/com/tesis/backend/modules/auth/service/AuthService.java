package com.tesis.backend.modules.auth.service;

import com.tesis.backend.modules.auth.dto.AuthResponse;
import com.tesis.backend.modules.auth.dto.ChangePasswordRequest;
import com.tesis.backend.modules.auth.dto.ForgotPasswordRequest;
import com.tesis.backend.modules.auth.dto.LoginRequest;
import com.tesis.backend.modules.auth.dto.RegisterUserRequest;
import com.tesis.backend.modules.auth.dto.ResetPasswordRequest;
import com.tesis.backend.modules.auth.dto.SetUserEmailRequest;
import com.tesis.backend.modules.auth.dto.StatusResponse;
import com.tesis.backend.modules.auth.dto.VerifyForgotTokenRequest;
import com.tesis.backend.modules.auth.model.EmailVerification;
import com.tesis.backend.modules.auth.model.ForgottenPassword;
import com.tesis.backend.modules.auth.repository.EmailVerificationRepository;
import com.tesis.backend.modules.auth.repository.ForgottenPasswordRepository;
import com.tesis.backend.modules.security.rbac.repository.RoleUserRepository;
import com.tesis.backend.modules.security.rbac.service.RoleService;
import com.tesis.backend.modules.user.dto.UserResponse;
import com.tesis.backend.modules.user.model.AccountStatus;
import com.tesis.backend.modules.user.model.User;
import com.tesis.backend.modules.user.repository.UserRepository;
import com.tesis.backend.modules.user.service.UserService;
import com.tesis.backend.security.JwtTokenService;
import com.tesis.backend.security.TokenBlacklistService;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final long FORGOT_PASSWORD_WINDOW_MINUTES = 60;

    private final UserRepository userRepository;
    private final UserService userService;
    private final RoleService roleService;
    private final RoleUserRepository roleUserRepository;
    private final ForgottenPasswordRepository forgottenPasswordRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthService(
        UserRepository userRepository,
        UserService userService,
        RoleService roleService,
        RoleUserRepository roleUserRepository,
        ForgottenPasswordRepository forgottenPasswordRepository,
        EmailVerificationRepository emailVerificationRepository,
        PasswordEncoder passwordEncoder,
        JwtTokenService jwtTokenService,
        TokenBlacklistService tokenBlacklistService
    ) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.roleService = roleService;
        this.roleUserRepository = roleUserRepository;
        this.forgottenPasswordRepository = forgottenPasswordRepository;
        this.emailVerificationRepository = emailVerificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Transactional
    public StatusResponse registerUser(RegisterUserRequest request, boolean forceActive) {
        String email = normalizeEmail(request.getEmail());
        User existing = userRepository.findByEmailIgnoreCase(email).orElse(null);

        if (existing != null && existing.getAccountStatus() != AccountStatus.Awaiting) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo registrado");
        }
        if (existing != null) {
            roleUserRepository.deleteByUserId(existing.getId());
            userRepository.delete(existing);
        }

        User user = new User();
        user.setEmail(email);
        user.setName(request.getName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setSalt(UUID.randomUUID().toString());

        AccountStatus accountStatus = forceActive
            ? AccountStatus.Active
            : (request.getAccountStatus() == null ? AccountStatus.Awaiting : request.getAccountStatus());
        user.setAccountStatus(accountStatus);
        user.setMeta(new HashMap<>());

        user = userRepository.save(user);
        roleService.assignRoleIfMissing(user.getId(), RoleService.ROLE_AUTH);

        if (accountStatus == AccountStatus.Awaiting) {
            createEmailToken(email);
        }

        return new StatusResponse(200, "Cuenta registrada");
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = userRepository
            .findByEmailIgnoreCaseAndAccountStatus(email, AccountStatus.Active)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Credenciales inválidas");
        }
        return createTokenResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank() || tokenBlacklistService.isRevoked(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token");
        }

        UUID userId = jwtTokenService.parseRefreshToken(refreshToken);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token");
        }

        User user = userRepository.findById(userId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token")
        );
        return createTokenResponse(user);
    }

    @Transactional
    public StatusResponse verifyEmail(String token) {
        EmailVerification verification = emailVerificationRepository
            .findByEmailToken(token)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        User user = userRepository
            .findByEmailIgnoreCaseAndAccountStatus(verification.getEmail(), AccountStatus.Awaiting)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        user.setAccountStatus(AccountStatus.Active);
        userRepository.save(user);
        emailVerificationRepository.delete(verification);
        return new StatusResponse(200, "El correo ha sido activado");
    }

    @Transactional
    public StatusResponse resendEmailVerification(String email) {
        String normalizedEmail = normalizeEmail(email);
        userRepository
            .findByEmailIgnoreCaseAndAccountStatus(normalizedEmail, AccountStatus.Awaiting)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid email"));

        createEmailToken(normalizedEmail);
        return new StatusResponse(200, "El correo ha sido enviado");
    }

    @Transactional
    public StatusResponse forgotPassword(ForgotPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        userRepository
            .findByEmailIgnoreCaseAndAccountStatus(email, AccountStatus.Active)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));

        ForgottenPassword forgottenPassword = forgottenPasswordRepository.findByEmailIgnoreCase(email).orElse(null);
        if (forgottenPassword != null) {
            long minutes = Duration.between(forgottenPassword.getUpdatedAt(), Instant.now()).toMinutes();
            if (minutes < FORGOT_PASSWORD_WINDOW_MINUTES) {
                return new StatusResponse(200, "El correo ha sido enviado");
            }
            forgottenPasswordRepository.delete(forgottenPassword);
        }

        ForgottenPassword model = new ForgottenPassword();
        model.setEmail(email);
        model.setPasswordToken(UUID.randomUUID().toString().replace("-", ""));
        forgottenPasswordRepository.save(model);

        return new StatusResponse(200, "El correo ha sido enviado");
    }

    @Transactional(readOnly = true)
    public Map<String, Boolean> verifyForgotToken(VerifyForgotTokenRequest request) {
        boolean exists = forgottenPasswordRepository
            .findByEmailIgnoreCaseAndPasswordToken(normalizeEmail(request.getEmail()), request.getPasswordToken())
            .isPresent();
        return Map.of("exists", exists);
    }

    @Transactional
    public StatusResponse resetPassword(ResetPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        ForgottenPassword forgottenPassword = forgottenPasswordRepository
            .findByEmailIgnoreCaseAndPasswordToken(email, request.getPasswordToken())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));

        User user = userRepository
            .findByEmailIgnoreCaseAndAccountStatus(email, AccountStatus.Active)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));

        setPasswordToUser(user, request.getNewPassword());
        forgottenPasswordRepository.delete(forgottenPassword);
        return new StatusResponse(200, "Contraseña cambiada");
    }

    @Transactional
    public StatusResponse changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userService.getEntityById(userId);
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña no es correcta");
        }
        setPasswordToUser(user, request.getNewPassword());
        return new StatusResponse(200, "Contraseña cambiada");
    }

    @Transactional
    public StatusResponse setUserEmail(UUID userId, SetUserEmailRequest request) {
        User user = userService.getEntityById(userId);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Credenciales inválidas");
        }

        String normalizedEmail = normalizeEmail(request.getEmail());
        User userByEmail = userRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
        if (userByEmail != null && !userByEmail.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo registrado");
        }

        user.setEmail(normalizedEmail);
        userRepository.save(user);
        return new StatusResponse(200, "Correo actualizado");
    }

    @Transactional(readOnly = true)
    public UserResponse getMe(UUID userId) {
        return userService.getById(userId);
    }

    public StatusResponse logout(String accessToken, String refreshToken) {
        if (accessToken != null && !accessToken.isBlank()) {
            tokenBlacklistService.revoke(accessToken, jwtTokenService.getTokenExpiration(accessToken));
        }
        if (refreshToken != null && !refreshToken.isBlank()) {
            tokenBlacklistService.revoke(refreshToken, jwtTokenService.getTokenExpiration(refreshToken));
        }
        return new StatusResponse(200, "Session closed succesfully");
    }

    private AuthResponse createTokenResponse(User user) {
        AuthResponse response = new AuthResponse();
        response.setToken(jwtTokenService.createAccessToken(user.getId()));
        response.setRefreshToken(jwtTokenService.createRefreshToken(user.getId()));
        response.setUser(userService.toResponse(user));
        return response;
    }

    private void setPasswordToUser(User user, String newPassword) {
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setSalt(UUID.randomUUID().toString());
        userRepository.save(user);
    }

    private void createEmailToken(String email) {
        EmailVerification verification = emailVerificationRepository.findByEmailIgnoreCase(email).orElse(new EmailVerification());
        verification.setEmail(email);
        verification.setEmailToken(UUID.randomUUID().toString());
        emailVerificationRepository.save(verification);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
