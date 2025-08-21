package com.project.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.project.entity.PostEntity;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long>{

	List<PostEntity> findAllByOrderByCreatedAtDesc();
	
	List<PostEntity> findByUser_UserNo(Long userNo);
}
