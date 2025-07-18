package com.project.project.service;

import java.time.LocalDateTime;
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
    
    //전체 게시글 조회
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    //조회수 증가
    public void increaseViewCount(Long id) {
        postRepository.findById(id).ifPresent(post -> {
            post.setView(post.getView() + 1);
            postRepository.save(post);
        });
    }

    //특정 게시글 조회
    public PostDTO getPost(Long id) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        return PostDTO.fromEntity(post);
    }

    //게시글 등록
    public Long createPost(PostDTO dto, String userId) {
        UserEntity user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        PostEntity post = dto.toEntity(user);
        return postRepository.save(post).getPostId();
    }

    //게시글 수정
    public void updatePost(Long id, PostDTO dto, String userId) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setUpdatedAt(LocalDateTime.now());
        
        postRepository.save(post);
    }

    //게시글 삭제
    public void deletePost(Long id, String userId) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        postRepository.delete(post);
    }

    //추천
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
    
    //사용자의 추천 여부
    public boolean isPostLikedByUser(Long id, String userId) {
        PostEntity post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        UserEntity user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return postLikesRepository.findByPostAndUser(post, user).isPresent();
    }
    
}
