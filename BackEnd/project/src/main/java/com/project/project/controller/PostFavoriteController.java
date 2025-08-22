package com.project.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.project.dto.PostFavoriteDTO;
import com.project.project.service.PostFavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/favorite")
public class PostFavoriteController {

	private final PostFavoriteService favoriteService;

	// 스크랩 추가
	@PostMapping("/{postId}")
	public ResponseEntity<Void> addFavorite(@PathVariable("postId") Long postId) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String userId = auth.getName(); // JWT에서 세팅한 userId 가져오기
		favoriteService.addFavorite(userId, postId);
		return ResponseEntity.ok().build();
	}

	// 스크랩 해제
	@DeleteMapping("/{postId}")
	public ResponseEntity<Void> removeFavorite(@PathVariable("postId") Long postId) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String userId = auth.getName();
		favoriteService.removeFavorite(userId, postId);
		return ResponseEntity.ok().build();
	}

	// 스크랩 조회
	@GetMapping
	public ResponseEntity<List<PostFavoriteDTO>> getFavorite() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String userId = auth.getName();
		return ResponseEntity.ok(favoriteService.getFavorite(userId));
	}
}
