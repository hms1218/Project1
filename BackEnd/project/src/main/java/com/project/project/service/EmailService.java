package com.project.project.service;

import java.io.File;

import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	private final JavaMailSender mailSender;
	
	public EmailService(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}
	
	public void sendPasswordResetEmail(String toEmail, String resetUrl) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail);
		message.setSubject("비밀번호 재설정 안내");
		message.setText("아래 링크를 클릭하여 비밀번호를 재설정하세요:\n" + resetUrl);
		mailSender.send(message);
	}
	
	// 이력서 첨부 파일 메일 보내기
    public void sendResumeEmail(String toEmail, File resumeFile) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true: multipart
        
        helper.setTo(toEmail);
        helper.setSubject("관리자의 이력서입니다");
        helper.setText("첨부된 이력서를 확인해 주세요.");

        FileSystemResource file = new FileSystemResource(resumeFile);
        helper.addAttachment(resumeFile.getName(), file);

        mailSender.send(message);
    }
}
