package com.project.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.project.entity.PostEntity;

public interface PostRepository extends JpaRepository<PostEntity, Long>{

	List<PostEntity> findAllByOrderByCreatedAtDesc();
}
