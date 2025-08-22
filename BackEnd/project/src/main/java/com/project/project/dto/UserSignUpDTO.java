package com.project.project.dto;

import com.project.project.entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSignUpDTO {
	private String userId;
	private String password;
	private String email;
	
	// DTO → Entity 변환
    public UserEntity toEntity(String encodedPassword) {
        return UserEntity.builder()
                .userId(this.userId)
                .password(encodedPassword)
                .email(this.email)
                .role("USER") // 기본 역할
                .build();
    }
}
