package com.project.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.project.dto.PostFavoriteDTO;
import com.project.project.entity.PostEntity;
import com.project.project.entity.PostFavoriteEntity;
import com.project.project.entity.UserEntity;
import com.project.project.repository.PostFavoriteRepository;
import com.project.project.repository.PostRepository;
import com.project.project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostFavoriteService {

	private final PostFavoriteRepository favoriteRepository;
	private final UserRepository userRepository;
	private final PostRepository postRepository;
	
	private static final String POST_NOT_FOUND_MSG = "게시글을 찾을 수 없습니다";
    private static final String USER_NOT_FOUND_MSG = "사용자를 찾을 수 없습니다";
	
    //스크랩 추가
    @Transactional
	public void addFavorite(String userId, Long postId) {
		UserEntity user = userRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MSG));
		PostEntity post = postRepository.findById(postId)
				.orElseThrow(() -> new RuntimeException(POST_NOT_FOUND_MSG));
		
		if(!favoriteRepository.existsByUserAndPost(user, post)) {
			favoriteRepository.save(PostFavoriteEntity.builder()
					.user(user)
					.post(post)
					.build());
		}
	}
	
	//스크랩 해제
    @Transactional
	public void removeFavorite(String userId, Long postId) {
		UserEntity user = userRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MSG));
		PostEntity post = postRepository.findById(postId)
				.orElseThrow(() -> new RuntimeException(POST_NOT_FOUND_MSG));
		
		favoriteRepository.deleteByUserAndPost(user, post);
	}
	
    //스크랩 조회
    @Transactional
    public List<PostFavoriteDTO> getFavorite(String userId){
    	UserEntity user = userRepository.findByUserId(userId)
    			.orElseThrow(() -> new RuntimeException(USER_NOT_FOUND_MSG));
    	
    	return favoriteRepository.findByUser(user).stream()
    			.map(fav -> PostFavoriteDTO.builder()
    	                .postId(fav.getPost().getPostId())
    	                .title(fav.getPost().getTitle()) // title 추가
    	                .build())
    			.collect(Collectors.toList());
    }
    
}
