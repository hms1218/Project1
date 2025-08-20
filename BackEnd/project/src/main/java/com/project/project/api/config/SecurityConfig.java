package com.project.project.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.project.project.api.auth.JwtAuthenticationFilter;
import com.project.project.api.token.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtTokenProvider jwtTokenProvider;
	
	@Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }
	
	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
	    return http.getSharedObject(AuthenticationManager.class);
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        	.csrf(csrf -> csrf.disable())  // API라면 보통 CSRF 비활성화
        	.cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                		"/",
                		// 로그인 / 회원가입
                		"/users/signup", 
                		"/users/signin",
                		"/users/check-id",
                		"/users/find-id",
                		"/users/find-pw",
                		"/users/validate-reset-token",
                		"/users/reset-password",
                		"/users/send-resume",
                		// 게시판
                		"/posts",
                		"/posts/**",
                		//댓글
                		"/comments/**",
                		"/files/upload",
                		"/files/**",
                		"/uploads/**"
                		).permitAll() // 인증없이 허용
                	.anyRequest().authenticated() // 그 외 요청은 인증 필요
        		)
            .addFilterBefore(jwtAuthenticationFilter(), 
	                UsernamePasswordAuthenticationFilter.class)
            .formLogin(form -> form.disable()) // 기본 로그인 폼 비활성화
            .httpBasic(basic -> basic.disable()); // 기본 HTTP Basic 인증 사용 가능

        return http.build();
    }
}
