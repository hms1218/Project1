package com.project.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.project.entity.CommentEntity;

public interface CommentRepository extends JpaRepository<CommentEntity, Long>{

	List<CommentEntity> findByPost_PostIdOrderByCreatedAtAsc(Long postId);
}
