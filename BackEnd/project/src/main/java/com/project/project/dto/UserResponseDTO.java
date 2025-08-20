package com.project.project.dto;

import java.time.LocalDateTime;

import com.project.project.entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
	private Long userNo;
	private String userId;
	private String email;
	private LocalDateTime createdAt;
	
	// Entity → DTO 변환
    public static UserResponseDTO fromEntity(UserEntity userEntity) {
        return UserResponseDTO.builder()
                .userNo(userEntity.getUserNo())
                .userId(userEntity.getUserId())
                .email(userEntity.getEmail())
                .createdAt(userEntity.getCreatedAt())
                .build();
    }
}
