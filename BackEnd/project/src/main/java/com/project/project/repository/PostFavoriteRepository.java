package com.project.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.project.entity.PostEntity;
import com.project.project.entity.PostFavoriteEntity;
import com.project.project.entity.UserEntity;

@Repository
public interface PostFavoriteRepository extends JpaRepository<PostFavoriteEntity, Long>{

	boolean existsByUserAndPost(UserEntity user, PostEntity post);
	void deleteByUserAndPost(UserEntity user, PostEntity post);
	List<PostFavoriteEntity> findByUser(UserEntity user);
}
