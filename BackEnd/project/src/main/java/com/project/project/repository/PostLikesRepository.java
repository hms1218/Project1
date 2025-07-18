package com.project.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.project.entity.PostEntity;
import com.project.project.entity.PostLikesEntity;
import com.project.project.entity.UserEntity;

public interface PostLikesRepository extends JpaRepository<PostLikesEntity, Long>{

	Optional<PostLikesEntity> findByPostAndUser(PostEntity post, UserEntity user);
    long countByPost(PostEntity post);
    void deleteByPostAndUser(PostEntity post, UserEntity user);
    void deleteAllByPost(PostEntity post);
}
