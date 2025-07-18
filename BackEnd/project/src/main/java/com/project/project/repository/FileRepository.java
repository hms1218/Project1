package com.project.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.project.entity.FileEntity;

public interface FileRepository extends JpaRepository<FileEntity, Long>{

	
}
