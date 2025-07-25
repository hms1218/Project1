package com.project.project.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.project.api.token.JwtTokenProvider;
import com.project.project.dto.UserResponseDTO;
import com.project.project.dto.UserSignInDTO;
import com.project.project.dto.UserSignUpDTO;
import com.project.project.entity.UserEntity;
import com.project.project.service.EmailService;
import com.project.project.service.UserService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
	
	private final UserService userService;
	private final EmailService emailService;
	private final JwtTokenProvider jwtTokenProvider;
	
	private static final String MESSAGE_KEY = "message";
	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
	
	//회원가입
	@PostMapping("/signup")
	public ResponseEntity<Object> signUp(@RequestBody UserSignUpDTO dto){
		try {
			UserResponseDTO response = userService.signUp(dto);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(Map.of(MESSAGE_KEY, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of(MESSAGE_KEY, "서버 오류가 발생했습니다."));
		}
	}
	
	//로그인
	@PostMapping("/signin")	
	public ResponseEntity<Map<String, Object>> signIn(@RequestBody UserSignInDTO dto){
		try {
	        Map<String, Object> response = userService.signIn(dto);
	        return ResponseEntity.ok(response);
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity
	                .badRequest()
	                .body(Map.of(MESSAGE_KEY, e.getMessage()));
	    }
	}
	
	//아이디 중복확인
	@GetMapping("/check-id")
	public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam("userId") String userId){
		boolean exists = userService.existsByUserId(userId);
		
		return ResponseEntity.ok(Map.of("exists", exists)); 
	}
	
	//아이디 찾기
	@GetMapping("/find-id")
	public ResponseEntity<Object> findByEmail(@RequestParam("email") String email){
		Optional<String> userId = userService.findUserIdByEmail(email);
		
		if(userId.isPresent()) {
			return ResponseEntity.ok(Map.of("userId", userId));
		} else {
			return ResponseEntity.badRequest().body(Map.of(MESSAGE_KEY, "해당 이메일로 등록된 아이디가 없습니다."));
		}
	}
	
	//비밀번호 찾기
	@PostMapping("/find-pw")
	public ResponseEntity<Map<String, String>> requestPasswordReset(@RequestParam("email") String email){
		Optional<UserEntity> userOpt = userService.findByEmail(email);
		
		if(userOpt.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of(MESSAGE_KEY, "해당 이메일로 등록된 사용자가 없습니다."));
		}
		
		String token = userService.createPasswordResetToken(userOpt.get().getUserId());
		
		String resetUrl = "http://project-bucbucket.s3-website.ap-northeast-2.amazonaws.com/reset-password?token=" + token;
		emailService.sendPasswordResetEmail(email, resetUrl);
		
		return ResponseEntity.ok(Map.of(MESSAGE_KEY, "비밀번호 재설정 링크를 이메일로 발송했습니다."));
	}
	
	//비밀번호 재설정 토큰 검증
	@GetMapping("/validate-reset-token")
	public ResponseEntity<Map<String, String>> validateResetToken(@RequestParam("token") String token) {
	    boolean valid = userService.validatePasswordResetToken(token);
	    if (!valid) {
	        return ResponseEntity.badRequest().body(Map.of(MESSAGE_KEY, "유효하지 않은 토큰입니다."));
	    }
	    return ResponseEntity.ok(Map.of(MESSAGE_KEY, "토큰이 유효합니다."));
	}
	
	//비밀번호 변경 api
	@PostMapping("/reset-password")
	public ResponseEntity<Map<String, String>> resetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
	    if (!userService.validatePasswordResetToken(token)) {
	        return ResponseEntity.badRequest().body(Map.of(MESSAGE_KEY, "유효하지 않은 토큰입니다."));
	    }

	    String userId = jwtTokenProvider.getUserIdFromToken(token);
	    userService.updatePassword(userId, newPassword);

	    return ResponseEntity.ok(Map.of(MESSAGE_KEY, "비밀번호가 성공적으로 변경되었습니다."));
	}
	
	//이력서 전송
	@PostMapping("/send-resume")
	public ResponseEntity<String> sendResume(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		File tempFile = null;
	    try {
	    	Resource resource = new ClassPathResource("resume/resume.pdf");
	    	
	    	InputStream inputStream = resource.getInputStream();
	        tempFile = Files.createTempFile("resume", ".pdf").toFile();
	        try (FileOutputStream out = new FileOutputStream(tempFile)) {
	            inputStream.transferTo(out);
	        }
	    	
	        emailService.sendResumeEmail(email, tempFile);
	        return ResponseEntity.ok("이력서 메일 발송 완료");
	    } catch (MessagingException e) {
	        logger.error("메일 발송 실패", e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("메일 발송 실패");
	    } catch (IOException e) {
	        logger.error("이력서 파일 로드 실패", e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이력서 파일 로드 실패");
	    } finally {
	    	boolean deleted = tempFile.delete();
	    	if(!deleted) {
	    		logger.error("임시 이력서 파일 삭제 실패: {}", tempFile.getAbsolutePath());
	    	}
	    }
	}
	
}
