package com.project.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.project.entity.CommentEntity;
import com.project.project.entity.PostEntity;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long>{

	List<CommentEntity> findByPost_PostIdOrderByCreatedAtAsc(Long postId);
	void deleteAllByPost(PostEntity post);
	
	List<CommentEntity> findByUser_UserNo(Long userNo);
}
