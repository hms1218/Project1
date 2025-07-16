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
	
	@GetMapping
    public List<PostDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public PostDTO getPost(@PathVariable("id") Long id) {
        return postService.getPost(id);
    }
    
    @PostMapping("/{id}/view")
    public void increaseView(@PathVariable("id") Long id) {
        postService.increaseViewCount(id);
    }

    @PostMapping
    public Long createPost(@RequestBody PostDTO dto, @RequestParam("userId") String userId) {
        return postService.createPost(dto, userId);
    }

    @PutMapping("/{id}")
    public void updatePost(@PathVariable("id") Long id, @RequestBody PostDTO dto, @RequestParam("userId") String userId) {
        postService.updatePost(id, dto, userId);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable("id") Long id, @RequestParam("userId") String userId) {
        postService.deletePost(id, userId);
    }

    @PostMapping("/{id}/likes")
    public int likePost(@PathVariable("id") Long id, @RequestParam("userId") String userId) {
        return postService.toggleLike(id, userId);
    }
    
    @GetMapping("/{id}/liked")
    public boolean checkIfLiked(
        @PathVariable("id") Long id,
        @RequestParam("userId") String userId) {
        return postService.isPostLikedByUser(id, userId);
    }
}
