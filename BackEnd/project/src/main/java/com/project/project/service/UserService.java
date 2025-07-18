package com.project.project.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.project.api.token.JwtTokenProvider;
import com.project.project.dto.UserResponseDTO;
import com.project.project.dto.UserSignInDTO;
import com.project.project.dto.UserSignUpDTO;
import com.project.project.entity.UserEntity;
import com.project.project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	private final JwtTokenProvider jwtTokenProvider;
	
	//회원가입
	public UserResponseDTO signUp(UserSignUpDTO dto) {
		//아이디 중복 검사
		if(userRepository.existsByUserId(dto.getUserId())) {
			throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
		}
		
		//이메일 중복 검사
		if(userRepository.existsByEmail(dto.getEmail())) {
			throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
		}
		
		//비밀번호 암호화
		String encodedPassword = passwordEncoder.encode(dto.getPassword());
		
		//엔티티 변환 (toEntity 사용)
		UserEntity user = dto.toEntity(encodedPassword);
		
		//저장
		UserEntity savedUser = userRepository.save(user);
		
		return UserResponseDTO.fromEntity(savedUser);
		
	}
	
	//로그인
	public Map<String, Object> signIn(UserSignInDTO dto) {
		Optional<UserEntity> entity = userRepository.findByUserId(dto.getUserId());
		
		if(entity.isEmpty()) {
			throw new IllegalArgumentException("등록되지 않은 아이디입니다.");
		}
		
		UserEntity user = entity.get();
		
		//비밀번호 일치 검사
		if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
			throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
		}
		
		String token = jwtTokenProvider.createToken(user.getUserId());

	    return Map.of(
	        "userId", user.getUserId(),
	        "token", token
	    );
	}
	
	//아이디 중복확인
	public boolean existsByUserId(String userId) {
		return userRepository.existsByUserId(userId);
	}
	
	//아이디 찾기
	public Optional<String> findUserIdByEmail(String email){
		Optional<UserEntity> user = userRepository.findByEmail(email);
		
		return user.map(UserEntity::getUserId);
	}
	
	//비밀번호 찾기
	public Optional<UserEntity> findByEmail(String email){
		return userRepository.findByEmail(email);
	}
	
	public String createPasswordResetToken(String userId) {
	   return jwtTokenProvider.createPasswordResetToken(userId);
	}
	
	//비밀번호 재설정 토큰 검증
	public boolean validatePasswordResetToken(String token) {
	    if (!jwtTokenProvider.validateToken(token)) {
	        return false;
	    }
	    String tokenType = jwtTokenProvider.getTokenType(token);
	    return "passwordReset".equals(tokenType);
	}
	
	//비밀번호 변경 api
	@Transactional
	public void updatePassword(String userId, String newPassword) {
	    Optional<UserEntity> userOpt = userRepository.findByUserId(userId);
	    if (userOpt.isEmpty()) {
	        throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
	    }

	    UserEntity user = userOpt.get();
	    String encodedPassword = passwordEncoder.encode(newPassword);
	    user.setPassword(encodedPassword);
	    userRepository.save(user);
	}
}
