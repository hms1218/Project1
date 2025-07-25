package com.project.project.api.exception;

public class UploadDirectoryCreationException extends RuntimeException {
	private static final long serialVersionUID = 1L; //클래스 버전 관리 번호
	
	public UploadDirectoryCreationException(String message, Throwable cause) {
		super(message, cause);
	}
}
