package com.tesis.backend.security;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistService {

    private final Map<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();

    public void revoke(String token, Instant expiration) {
        cleanupExpired();
        blacklistedTokens.put(token, expiration == null ? Instant.now() : expiration);
    }

    public boolean isRevoked(String token) {
        cleanupExpired();
        Instant expiration = blacklistedTokens.get(token);
        if (expiration == null) {
            return false;
        }
        if (expiration.isBefore(Instant.now())) {
            blacklistedTokens.remove(token);
            return false;
        }
        return true;
    }

    private void cleanupExpired() {
        Instant now = Instant.now();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}

