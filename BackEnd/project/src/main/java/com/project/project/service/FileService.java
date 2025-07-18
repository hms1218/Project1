package com.project.project.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.project.component.FileStorage;
import com.project.project.entity.FileEntity;
import com.project.project.repository.FileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

	private final FileRepository fileRepository;
	private final FileStorage fileStorage;
	
	public List<String> uploadFiles(List<MultipartFile> files){
		List<String> fileUrls = new ArrayList<>();
		for(MultipartFile file : files) {
			String storedFilePath = fileStorage.store(file);
			fileRepository.save(
				FileEntity.builder()
					.fileName(file.getOriginalFilename())
					.filePath(storedFilePath)
					.build()
			);
			fileUrls.add(storedFilePath);
		}
		return fileUrls;
	}
	
	public void deleteFile(Long fileId) {
		FileEntity entity = fileRepository.findById(fileId)
			.orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));
		fileStorage.delete(entity.getFilePath());
		fileRepository.delete(entity);
	}
}
