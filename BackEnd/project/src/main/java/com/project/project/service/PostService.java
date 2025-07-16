package com.project.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.project.dto.PostDTO;
import com.project.project.entity.PostEntity;
import com.project.project.entity.PostLikesEntity;
import com.project.project.entity.UserEntity;
import com.project.project.repository.PostLikesRepository;
import com.project.project.repository.PostRepository;
import com.project.project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

	private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostLikesRepository postLikesRepository;
    
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public void increaseViewCount(Long id) {
        postRepository.findById(id).ifPresent(post -> {
            post.setView(post.getView() + 1);
            postRepository.save(post);
        });
    }

    public PostDTO getPost(Long id) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        return PostDTO.fromEntity(post);
    }

    public Long createPost(PostDTO dto, String userId) {
        UserEntity user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        PostEntity post = dto.toEntity(user);
        return postRepository.save(post).getPostId();
    }

    public void updatePost(Long id, PostDTO dto, String userId) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        postRepository.save(post);
    }

    public void deletePost(Long id, String userId) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        postRepository.delete(post);
    }

    public int toggleLike(Long id, String userId) {
        PostEntity post = postRepository.findById(id)
        		.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Optional<PostLikesEntity> existingLike = postLikesRepository.findByPostAndUser(post, user);
        
        if (existingLike.isPresent()) {
            // 좋아요 취소
            postLikesRepository.delete(existingLike.get());
        } else {
            // 좋아요 추가
            PostLikesEntity newLike = PostLikesEntity.builder()
                .post(post)
                .user(user)
                .build();
            postLikesRepository.save(newLike);
        }
        
        long likeCount = postLikesRepository.countByPost(post);
        post.setLikes((int) likeCount);
        postRepository.save(post);
        return post.getLikes();
    }
    
    public boolean isPostLikedByUser(Long id, String userId) {
        PostEntity post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        UserEntity user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return postLikesRepository.findByPostAndUser(post, user).isPresent();
    }
    
}
