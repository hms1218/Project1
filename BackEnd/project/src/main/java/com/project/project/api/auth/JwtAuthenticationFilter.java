package com.project.project.api.auth;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.project.api.token.JwtTokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	// 인증 제외 경로 리스트
	private static final List<String> EXCLUDED_PATHS = List.of("/", "/users/signup", "/users/signin", "/users/check-id",
			"/users/find-id", "/users/find-pw", "/users/validate-reset-token", "/users/reset-password",
			"/users/send-resume", "/posts", "/comments", "/files/upload", "/files", "/uploads");

//	private static final List<String> EXCLUDED_PATHS = List.of(
//		    "/", 
//		    "/users/signup", 
//		    "/users/signin", 
//		    "/users/check-id",
//		    "/users/find-id", 
//		    "/users/find-pw", 
//		    "/users/validate-reset-token", 
//		    "/users/reset-password",
//		    "/users/send-resume"
//		);
	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
		this.jwtTokenProvider = jwtTokenProvider;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		log.debug("JwtAuthenticationFilter is running");

		String path = request.getServletPath();

//		boolean excluded = EXCLUDED_PATHS.stream().anyMatch(path::startsWith);
		boolean excluded = EXCLUDED_PATHS.contains(path);
		System.out.println("path::"+EXCLUDED_PATHS);
		if (excluded) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = resolveToken(request);
		System.out.println("JWT Token: " + token);

		if (token != null) {
		    boolean valid = jwtTokenProvider.validateToken(token);
		    System.out.println("JWT valid: " + valid);

		    if(valid) {
		        String userId = jwtTokenProvider.getUserIdFromToken(token);
		        List<String> roles = jwtTokenProvider.getRolesFromToken(token);

		        // roles가 비어있으면 기본값으로 USER 넣기
		        if(roles == null || roles.isEmpty()) roles = List.of("USER");

		        List<GrantedAuthority> authorities = roles.stream()
		            .map(SimpleGrantedAuthority::new)
		            .collect(Collectors.toList());

		        Authentication auth = new UsernamePasswordAuthenticationToken(userId, null, authorities);
		        SecurityContextHolder.getContext().setAuthentication(auth);

		        System.out.println("Authentication set: " + SecurityContextHolder.getContext().getAuthentication());
		    } else {
		        System.out.println("Token invalid");
		    }
		} else {
		    System.out.println("Token null");
		}
		
		// ✅ filterChain 실행 전/후 비교
	    System.out.println("Before filterChain.doFilter, SecurityContext: " 
	        + SecurityContextHolder.getContext().getAuthentication());

		filterChain.doFilter(request, response);
		
		System.out.println("After filterChain.doFilter, SecurityContext: " 
		        + SecurityContextHolder.getContext().getAuthentication());
	}

	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		System.out.println("Authorization Header: " + bearerToken);
		if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}
}
