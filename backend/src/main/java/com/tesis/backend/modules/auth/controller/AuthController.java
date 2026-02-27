package com.tesis.backend.modules.auth.controller;

import com.tesis.backend.modules.auth.dto.AuthResponse;
import com.tesis.backend.modules.auth.dto.ChangePasswordRequest;
import com.tesis.backend.modules.auth.dto.ForgotPasswordRequest;
import com.tesis.backend.modules.auth.dto.LoginRequest;
import com.tesis.backend.modules.auth.dto.RefreshTokenRequest;
import com.tesis.backend.modules.auth.dto.RegisterUserRequest;
import com.tesis.backend.modules.auth.dto.ResetPasswordRequest;
import com.tesis.backend.modules.auth.dto.SetUserEmailRequest;
import com.tesis.backend.modules.auth.dto.StatusResponse;
import com.tesis.backend.modules.auth.dto.VerifyEmailRequest;
import com.tesis.backend.modules.auth.dto.VerifyForgotTokenRequest;
import com.tesis.backend.modules.auth.service.AuthService;
import com.tesis.backend.modules.user.dto.UserResponse;
import com.tesis.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public StatusResponse register(@Valid @RequestBody RegisterUserRequest request) {
        return authService.registerUser(request, false);
    }

    @PostMapping("/admin/register")
    @PreAuthorize("hasRole('ADMIN')")
    public StatusResponse adminRegisterUser(@Valid @RequestBody RegisterUserRequest request) {
        return authService.registerUser(request, true);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refreshToken(
        @RequestHeader(value = "refresh_token", required = false) String refreshTokenHeader,
        @RequestHeader(value = "RefreshToken", required = false) String refreshTokenHeaderAlt,
        @RequestBody(required = false) RefreshTokenRequest refreshTokenRequest
    ) {
        String refreshToken = refreshTokenHeader;
        if (refreshToken == null || refreshToken.isBlank()) {
            refreshToken = refreshTokenHeaderAlt;
        }
        if ((refreshToken == null || refreshToken.isBlank()) && refreshTokenRequest != null) {
            refreshToken = refreshTokenRequest.getRefreshToken();
        }
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token");
        }
        return authService.refreshToken(refreshToken);
    }

    @PostMapping("/verify-email")
    public StatusResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return authService.verifyEmail(request.getToken());
    }

    @PostMapping("/resend-email-verification")
    public StatusResponse resendEmailVerification(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.resendEmailVerification(request.getEmail());
    }

    @PostMapping("/forgot-password")
    public StatusResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/verify-forgot-token")
    public Map<String, Boolean> verifyForgotToken(@Valid @RequestBody VerifyForgotTokenRequest request) {
        return authService.verifyForgotToken(request);
    }

    @PostMapping("/reset-password")
    public StatusResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PostMapping("/change-password")
    public StatusResponse changePassword(
        @AuthenticationPrincipal AuthenticatedUser currentUser,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return authService.changePassword(currentUser.getUserId(), request);
    }

    @PostMapping("/set-email")
    public StatusResponse setUserEmail(
        @AuthenticationPrincipal AuthenticatedUser currentUser,
        @Valid @RequestBody SetUserEmailRequest request
    ) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return authService.setUserEmail(currentUser.getUserId(), request);
    }

    @GetMapping("/me")
    public UserResponse getMe(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return authService.getMe(currentUser.getUserId());
    }

    @PostMapping("/logout")
    public StatusResponse logout(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @RequestHeader(value = "refresh_token", required = false) String refreshTokenHeader,
        @RequestHeader(value = "RefreshToken", required = false) String refreshTokenHeaderAlt
    ) {
        String accessToken = authorization;
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring("Bearer ".length());
        }
        String refreshToken = refreshTokenHeader;
        if (refreshToken == null || refreshToken.isBlank()) {
            refreshToken = refreshTokenHeaderAlt;
        }
        return authService.logout(accessToken, refreshToken);
    }
}
