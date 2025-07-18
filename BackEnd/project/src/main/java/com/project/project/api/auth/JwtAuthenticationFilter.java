package com.project.project.api.auth;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.project.api.token.JwtTokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter{

	private final JwtTokenProvider jwtTokenProvider;
	
	// 인증 제외 경로 리스트
    private static final List<String> EXCLUDED_PATHS = List.of(
        "/",
        "/users/signup",
        "/users/signin",
        "/users/check-id",
        "/users/find-id",
        "/users/find-pw",
        "/users/validate-reset-token",
        "/users/reset-password",
        "/users/send-resume",
        "/posts",
        "/comments",
        "/files/upload",
        "/files"
    );
	
	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, 
									HttpServletResponse response, 
									FilterChain filterChain)
									throws ServletException, IOException {
		System.out.println("JwtAuthenticationFilter is running");

        String path = request.getServletPath();
        
        boolean excluded = EXCLUDED_PATHS.stream().anyMatch(path::startsWith);
        if (excluded) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null, null);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
	}
	
	private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
