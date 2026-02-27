package com.tesis.backend.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, max = 100)
    private String passwordToken;

    @NotBlank
    @Size(min = 8, max = 100)
    private String newPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordToken() {
        return passwordToken;
    }

    public void setPasswordToken(String passwordToken) {
        this.passwordToken = passwordToken;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

