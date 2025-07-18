package com.project.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.project.dto.CommentDTO;
import com.project.project.entity.CommentEntity;
import com.project.project.entity.PostEntity;
import com.project.project.entity.UserEntity;
import com.project.project.repository.CommentRepository;
import com.project.project.repository.PostRepository;
import com.project.project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
	
	private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        return commentRepository.findByPost_PostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public Long addComment(Long postId, String content, String userId) {
        PostEntity post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        UserEntity user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        CommentEntity comment = CommentEntity.builder()
                .post(post)
                .user(user)
                .content(content)
                .build();

        return commentRepository.save(comment).getCommentId();
    }
    
    @Transactional
    public CommentDTO updateComment(Long commentId, String content, String userId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!comment.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        comment.setContent(content);
        
        CommentEntity updated = commentRepository.save(comment); 

        return CommentDTO.fromEntity(updated);
    }

    @Transactional
    public void deleteComment(Long commentId, String userId) {
        CommentEntity comment = commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        commentRepository.delete(comment);
    }

}
