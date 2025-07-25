package com.project.project.component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.project.project.api.exception.FileDeletionException;
import com.project.project.api.exception.FileStorageException;
import com.project.project.api.exception.UploadDirectoryCreationException;

@Component
public class FileStorage {

	private static final String uploadDir = "C:\\Users\\admin\\Desktop\\uploads";
	
	public FileStorage() {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                throw new UploadDirectoryCreationException("업로드 디렉토리 생성 실패", e);
            }
        }
    }
	
	public String store(MultipartFile file) {
		try {
			String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
			Path filePath = Paths.get(uploadDir, fileName);
			Files.copy(file.getInputStream(), filePath);
			return filePath.toString();
		} catch (IOException e) {
			throw new FileStorageException("파일 저장 실패", e);
		}
	}
	
	public void delete(String filePath) {
		try {
			Files.deleteIfExists(Paths.get(filePath));
		} catch (IOException e) {
			throw new FileDeletionException("파일 삭제 실패", e);
		}
	}
	
}
