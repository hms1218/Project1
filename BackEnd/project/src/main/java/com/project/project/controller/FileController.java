package com.project.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.project.dto.FileDTO;
import com.project.project.service.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

	private final FileService fileService;
	
	//파일 업로드
	@PostMapping("/upload")
	public ResponseEntity<List<String>> uploadFiles(
			@RequestParam("files") List<MultipartFile> files,
			@RequestParam("postId") Long postId){
		List<String> uploadedFilesUrl = fileService.uploadFiles(files, postId);
		return ResponseEntity.ok(uploadedFilesUrl);
	}
	
	//파일 삭제
	@DeleteMapping("/{fileId}")
	public ResponseEntity<Void> deleteFiles(@PathVariable("fileId") Long fileId){
		fileService.deleteFile(fileId);
		return ResponseEntity.noContent().build();
	}
	
	//파일 조회
	@GetMapping("/{postId}")
	public ResponseEntity<?> getFilesById(@PathVariable("postId") Long postId){
		List<FileDTO> files = fileService.getFilesById(postId);
		
		return ResponseEntity.ok(files);
	}
}
