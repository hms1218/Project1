package com.project.project.dto;

import java.time.LocalDateTime;

import com.project.project.entity.CommentEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {

	private Long commentId;
    private String content;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Entity -> DTO 변환
    public static CommentDTO fromEntity(CommentEntity comment) {
        return CommentDTO.builder()
                .commentId(comment.getCommentId())
                .content(comment.getContent())
                .author(comment.getUser().getUserId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
