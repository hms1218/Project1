package com.project.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.project.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{

	//아이디로 회원 조회하기
	Optional<UserEntity> findByUserId(String userId);
	
	//이메일로 회원 조회하기
	Optional<UserEntity> findByEmail(String email);
	
	//아이디 존재 여부 체크
	boolean existsByUserId(String userId);
	
	//이메일 존재 여부 체크
	boolean existsByEmail(String email);
}
