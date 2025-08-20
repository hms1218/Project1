package com.project.project.api.token;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
	private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    public String createToken(String userId, List<String> roles) {
        Claims claims = Jwts.claims().setSubject(userId);
        claims.put("roles", roles);
        claims.put("type", "access");

        Date now = new Date();
        Date validity = new Date(now.getTime() + 1000 * 60 * 60); //1시간

        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key)
                .compact();

        System.out.println("Issued JWT Token: " + token);  // 발급 직후 토큰 확인
        return token;
    }
    
    public String createPasswordResetToken(String userId) {
        Claims claims = Jwts.claims().setSubject(userId);
        claims.put("type", "passwordReset");

        Date now = new Date();
        Date validity = new Date(now.getTime() + 1000 * 60 * 30); // 30분

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key)
                .compact();
    }
    
    public String getUserIdFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
        	System.out.println("Signing key: " + key);
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            System.out.println("Token is valid");
            return true;
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.out.println("Token expired: " + e.getMessage());
        } catch (io.jsonwebtoken.SignatureException e) {
            System.out.println("Signature invalid: " + e.getMessage());
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            System.out.println("Malformed token: " + e.getMessage());
        } catch (io.jsonwebtoken.UnsupportedJwtException e) {
            System.out.println("Unsupported token: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("Token is null or empty: " + e.getMessage());
        }
        return false;
    }
    
    public String getTokenType(String token) {
        Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        return (String) claims.get("type");
    }
    
    public List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List<?>) {
            return ((List<?>) rolesObj).stream()
                     .map(Object::toString)
                     .collect(Collectors.toList());
        }
        return List.of(); // roles 없으면 빈 리스트 반환
    }
}
