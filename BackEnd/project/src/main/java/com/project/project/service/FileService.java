package com.project.project.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.project.component.FileStorage;
import com.project.project.dto.FileDTO;
import com.project.project.entity.FileEntity;
import com.project.project.entity.PostEntity;
import com.project.project.repository.FileRepository;
import com.project.project.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

	private final FileRepository fileRepository;
	private final FileStorage fileStorage;
	private final PostRepository postRepository;
	
	//파일 업로드
	public List<String> uploadFiles(List<MultipartFile> files, Long postId){
		
		PostEntity post = postRepository.findById(postId)
								.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
		
		List<String> fileUrls = new ArrayList<>();
		
		for(MultipartFile file : files) {
			String storedFilePath = fileStorage.store(file);
			fileRepository.save(
				FileEntity.builder()
					.fileName(file.getOriginalFilename())
					.filePath(storedFilePath)
					.post(post)
					.build()
			);
			fileUrls.add(storedFilePath);
		}
		return fileUrls;
	}
	
	//파일 삭제
	public void deleteFile(Long fileId) {
		FileEntity entity = fileRepository.findById(fileId)
			.orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));
		fileStorage.delete(entity.getFilePath());
		fileRepository.delete(entity);
	}
	
	@Transactional
	public void deleteFilesByPostId(Long postId) {
	    List<FileEntity> files = fileRepository.findByPost_PostId(postId);

	    for (FileEntity file : files) {
	        fileStorage.delete(file.getFilePath()); // 스토리지 파일도 함께 삭제
	    }

	    fileRepository.deleteByPost_PostId(postId); // DB 연관 파일 Row 일괄 삭제
	}
	
	//파일 조회
	public List<FileDTO> getFilesById(Long postId) {
		List<FileEntity> files = fileRepository.findByPost_PostId(postId);
		
		return files.stream()
				.map(file -> FileDTO.builder()
						.id(file.getId())
						.filePath(file.getFilePath())
						.fileName(file.getFileName())
						.build())
				.collect(Collectors.toList());
	}
}
