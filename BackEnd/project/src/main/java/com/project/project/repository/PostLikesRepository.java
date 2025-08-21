package com.project.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.project.entity.PostEntity;
import com.project.project.entity.PostLikesEntity;
import com.project.project.entity.UserEntity;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLikesEntity, Long>{

	Optional<PostLikesEntity> findByPostAndUser(PostEntity post, UserEntity user);
    long countByPost(PostEntity post);
    void deleteByPostAndUser(PostEntity post, UserEntity user);
    void deleteAllByPost(PostEntity post);
}
