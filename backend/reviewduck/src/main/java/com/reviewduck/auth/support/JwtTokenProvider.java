package com.reviewduck.auth.support;

import java.util.Date;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.reviewduck.auth.exception.AuthorizationException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {

    private final long validityInMilliseconds;
    private final long refreshValidityInMilliseconds;
    private final String secretKey;

    public JwtTokenProvider(@Value("${security.jwt.token.expire-length}") long validityInMilliseconds,
        @Value("${security.jwt.refresh-token.expire-length}") long refreshValidityInMilliseconds,
        @Value("${security.jwt.token.secret-key}") String secretKey) {
        this.validityInMilliseconds = validityInMilliseconds;
        this.refreshValidityInMilliseconds = refreshValidityInMilliseconds;
        this.secretKey = secretKey;
    }

    public String createAccessToken(String payload) {
        Claims claims = Jwts.claims().setSubject(payload);
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }

    public String createRefreshToken(String payload) {
        Claims claims = Jwts.claims().setSubject(payload);
        Date now = new Date();
        Date refreshValidity = new Date(now.getTime() + refreshValidityInMilliseconds);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(refreshValidity)
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }

    public String getPayload(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
            .getBody().getSubject();
    }

    public boolean isInvalidToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);

            return claims.getBody().getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return true;
        }
    }

    public void validateToken(String token) {
        validateNullToken(token);

        validateInvalidToken(token);
    }

    private void validateNullToken(String token) {
        if (Objects.isNull(token)) {
            throw new AuthorizationException("토큰이 없습니다.");
        }
    }

    private void validateInvalidToken(String token) {
        if (isInvalidToken(token)) {
            throw new AuthorizationException("인증되지 않은 사용자입니다.");
        }
    }
}
