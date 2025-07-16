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

import com.project.project.dto.CommentDTO;
import com.project.project.dto.CommentUpdateDTO;
import com.project.project.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {
	
	private final CommentService commentService;
	
	@GetMapping("/{postId}")
    public List<CommentDTO> getComments(@PathVariable("postId") Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping("/{postId}")
    public Long addComment(@PathVariable("postId") Long postId, @RequestParam("content") String content, @RequestParam("userId") String userId) {
        return commentService.addComment(postId, content, userId);
    }
    
    @PutMapping("/{commentId}")
    public CommentDTO updateComment(
            @PathVariable("commentId") Long commentId,
            @RequestBody CommentUpdateDTO request,
            @RequestParam("userId") String userId) {

        return commentService.updateComment(commentId, request.getContent(), userId);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable("commentId") Long commentId, @RequestParam("userId") String userId) {
        commentService.deleteComment(commentId, userId);
    }
}
