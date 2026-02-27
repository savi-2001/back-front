package com.tesis.backend.modules.auth.dto;

public class StatusResponse {

    private int status;
    private String message;

    public StatusResponse() {
    }

    public StatusResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

