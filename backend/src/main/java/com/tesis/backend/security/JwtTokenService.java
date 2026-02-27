package com.tesis.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private final SecretKey secretKey;
    private final long accessTokenMinutes;
    private final long refreshTokenMinutes;

    public JwtTokenService(
        @Value("${security.jwt.secret}") String jwtSecret,
        @Value("${security.jwt.access-token-exp-minutes}") long accessTokenMinutes,
        @Value("${security.jwt.refresh-token-exp-minutes}") long refreshTokenMinutes
    ) {
        this.secretKey = buildSecret(jwtSecret);
        this.accessTokenMinutes = accessTokenMinutes;
        this.refreshTokenMinutes = refreshTokenMinutes;
    }

    public String createAccessToken(UUID userId) {
        Instant now = Instant.now();
        Instant expiration = now.plus(accessTokenMinutes, ChronoUnit.MINUTES);
        return Jwts.builder()
            .subject(userId.toString())
            .claim("type", "access")
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(secretKey)
            .compact();
    }

    public String createRefreshToken(UUID userId) {
        Instant now = Instant.now();
        Instant expiration = now.plus(refreshTokenMinutes, ChronoUnit.MINUTES);
        return Jwts.builder()
            .subject("refreshToken_" + userId)
            .claim("type", "refresh")
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(secretKey)
            .compact();
    }

    public UUID parseAccessToken(String token) {
        Claims claims = parseClaims(token);
        if (claims == null || !"access".equals(claims.get("type", String.class))) {
            return null;
        }
        try {
            return UUID.fromString(claims.getSubject());
        } catch (RuntimeException ex) {
            return null;
        }
    }

    public UUID parseRefreshToken(String token) {
        Claims claims = parseClaims(token);
        if (claims == null || !"refresh".equals(claims.get("type", String.class))) {
            return null;
        }
        String subject = claims.getSubject();
        if (subject == null || !subject.startsWith("refreshToken_")) {
            return null;
        }
        try {
            return UUID.fromString(subject.substring("refreshToken_".length()));
        } catch (RuntimeException ex) {
            return null;
        }
    }

    public Instant getTokenExpiration(String token) {
        Claims claims = parseClaims(token);
        if (claims == null || claims.getExpiration() == null) {
            return Instant.now();
        }
        return claims.getExpiration().toInstant();
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (RuntimeException ex) {
            return null;
        }
    }

    private SecretKey buildSecret(String jwtSecret) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest(jwtSecret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception ex) {
            throw new IllegalStateException("Cannot initialize JWT secret key", ex);
        }
    }
}

