package com.project.project.dto;

import java.time.LocalDateTime;

import com.project.project.entity.PostEntity;
import com.project.project.entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {

	private Long postId;
    private String title;
    private String content;
    private String author;
    private int view;
    private int likes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    //DTO -> Entity 변환
    public PostEntity toEntity(UserEntity user) {
        return PostEntity.builder()
                .title(this.title)
                .content(this.content)
                .user(user) // DTO에는 user 정보가 없으므로 파라미터로 받아 주입
                .build();
    }
    
    //Entity -> DTO 변환
    public static PostDTO fromEntity(PostEntity post) {
        return PostDTO.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getUser().getUserId())
                .view(post.getView())
                .likes(post.getLikes())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
