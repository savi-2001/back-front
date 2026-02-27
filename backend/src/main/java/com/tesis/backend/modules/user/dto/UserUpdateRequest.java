package com.tesis.backend.modules.user.dto;

import com.tesis.backend.modules.user.model.AccountStatus;
import jakarta.validation.constraints.Email;
import java.util.List;
import java.util.Map;

public class UserUpdateRequest {

    @Email
    private String email;

    private String name;

    private AccountStatus accountStatus;

    private Map<String, Object> meta;

    private List<String> roles;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public Map<String, Object> getMeta() {
        return meta;
    }

    public void setMeta(Map<String, Object> meta) {
        this.meta = meta;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}

