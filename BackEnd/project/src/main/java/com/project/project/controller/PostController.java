package com.project.project.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.project.dto.PostDTO;
import com.project.project.dto.PostLikesDTO;
import com.project.project.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostController {
	
	private final PostService postService;
	
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
}
