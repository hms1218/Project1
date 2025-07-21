package com.project.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.project.entity.FileEntity;

public interface FileRepository extends JpaRepository<FileEntity, Long>{

	List<FileEntity> findByPost_PostId(Long postId);
	void deleteByPost_PostId(Long postId);
}
