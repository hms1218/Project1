package com.project.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.project.api.token.JwtTokenProvider;
import com.project.project.dto.PostDTO;
import com.project.project.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostController {
	
	private final PostService postService;
	private final JwtTokenProvider jwtTokenProvider;
	
	//전체 게시글 조회
	@GetMapping
    public List<PostDTO> getAllPosts() {
        return postService.getAllPosts();
    }

	//특정 게시글 조회
    @GetMapping("/{id}")
    public PostDTO getPost(@PathVariable("id") Long id) {
        return postService.getPost(id);
    }
    
    //조회수 증가
    @PostMapping("/{id}/view")
    public void increaseView(@PathVariable("id") Long id) {
        postService.increaseViewCount(id);
    }

    //게시글 등록
    @PostMapping
    public Long createPost(@RequestBody PostDTO dto, @RequestParam("userId") String userId) {
        return postService.createPost(dto, userId);
    }

    //게시글 수정
    @PutMapping("/{id}")
    public void updatePost(@PathVariable("id") Long id, @RequestBody PostDTO dto, @RequestParam("userId") String userId) {
        postService.updatePost(id, dto, userId);
    }

    //게시글 삭제
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable("id") Long id, @RequestParam("userId") String userId) {
        postService.deletePost(id, userId);
    }

    //추천
    @PostMapping("/{id}/likes")
    public int likePost(@PathVariable("id") Long id, @RequestParam("userId") String userId) {
        return postService.toggleLike(id, userId);
    }
    
    //사용자의 추천 여부
    @GetMapping("/{id}/liked")
    public boolean checkIfLiked(
        @PathVariable("id") Long id,
        @RequestParam("userId") String userId) {
        return postService.isPostLikedByUser(id, userId);
    }
    
    //마이페이지 : 내가 작성한 글 조회
    @GetMapping("/my")
    public ResponseEntity<List<PostDTO>> getMyPosts(@RequestHeader("Authorization") String authorizationHeader) {
    	// "Bearer " 접두어 제거
    	String token = null;
    	if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
    		token = authorizationHeader.substring(7);
    	}
    	
    	if(token == null) {
    		return ResponseEntity.status(401).build(); // 토큰 없으면 Unauthorized
    	}
    	
    	String userId = jwtTokenProvider.getUserIdFromToken(token);
    	List<PostDTO> myPosts = postService.getMyPosts(userId);
    	
    	return ResponseEntity.ok(myPosts);
    }
}
