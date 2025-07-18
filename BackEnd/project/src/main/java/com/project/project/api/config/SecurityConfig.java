package com.project.project.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        	.cors()
        	.and()
            .csrf().disable()  // API라면 보통 CSRF 비활성화
            .authorizeHttpRequests()
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
                		"files/upload",
                		"files/**"
                		).permitAll() // 회원가입, 로그인은 인증없이 허용
                .anyRequest().authenticated()  // 그 외 요청은 인증 필요
            .and()
            .formLogin().disable() // 기본 로그인 폼 비활성화
            .httpBasic().disable() // 기본 HTTP Basic 인증 사용 가능
	        .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), 
	                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
