package com.project.project.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.project.dto.PostDTO;
import com.project.project.entity.PostEntity;
import com.project.project.entity.PostLikesEntity;
import com.project.project.entity.UserEntity;
import com.project.project.repository.CommentRepository;
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
    private final CommentRepository commentRepository;
    private final FileService fileService;
    
    private static final String POST_NOT_FOUND_MSG = "게시글을 찾을 수 없습니다";
    private static final String USER_NOT_FOUND_MSG = "사용자를 찾을 수 없습니다";
    
    //전체 게시글 조회
    @Transactional(readOnly = true)
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostDTO::fromEntity)
                .toList();
    }
    
    //조회수 증가
    @Transactional
    public void increaseViewCount(Long id) {
        postRepository.findById(id).ifPresent(post -> {
            post.setView(post.getView() + 1);
            postRepository.save(post);
        });
    }

    //특정 게시글 조회
    @Transactional(readOnly = true)
    public PostDTO getPost(Long id) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException(POST_NOT_FOUND_MSG));

        return PostDTO.fromEntity(post);
    }

  //게시글 등록
    @Transactional
    public Long createPost(PostDTO dto, String userId) {
        UserEntity user = userRepository.findByUserId(userId)
        		.orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MSG));
        PostEntity post = dto.toEntity(user);
        return postRepository.save(post).getPostId();
    }

    //게시글 수정
    @Transactional
    public void updatePost(Long id, PostDTO dto, String userId) {
        PostEntity post = postRepository.findById(id).orElseThrow(() -> new RuntimeException(POST_NOT_FOUND_MSG));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("수정 권한이 없습니다.");
        }
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setUpdatedAt(LocalDateTime.now());
        
        postRepository.save(post);
    }

    //게시글 삭제
    @Transactional
    public void deletePost(Long id, String userId) {
        PostEntity post = postRepository.findById(id)
        		.orElseThrow(() -> new RuntimeException(POST_NOT_FOUND_MSG));
        
        if (!post.getUser().getUserId().equals(userId) && !userId.equals("rhkwmq93")) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }
        
        commentRepository.deleteAllByPost(post);
        
        postLikesRepository.deleteAllByPost(post);
        
        fileService.deleteFilesByPostId(id);
        
        postRepository.delete(post);
    }

    //추천
    @Transactional
    public int toggleLike(Long id, String userId) {
        PostEntity post = postRepository.findById(id)
        		.orElseThrow(() -> new RuntimeException(POST_NOT_FOUND_MSG));
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MSG));
        
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
    @Transactional(readOnly = true)
    public boolean isPostLikedByUser(Long id, String userId) {
        PostEntity post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(POST_NOT_FOUND_MSG));
        UserEntity user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MSG));
        return postLikesRepository.findByPostAndUser(post, user).isPresent();
    }
    
    //마이페이지 : 내가 작성한 글 조회
    @Transactional(readOnly = true)
    public List<PostDTO> getMyPosts(String userId) {
    	UserEntity user = userRepository.findByUserId(userId)
    			.orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MSG));
    	
    	return postRepository.findByUser_UserNo(user.getUserNo())
    			.stream()
    			.map(PostDTO::fromEntity)
    			.toList();
    }
    
}
