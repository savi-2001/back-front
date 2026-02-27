package com.tesis.backend.modules.auth.dto;

import com.tesis.backend.modules.user.dto.UserResponse;

public class AuthResponse {

    private UserResponse user;
    private String token;
    private String refreshToken;

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}

