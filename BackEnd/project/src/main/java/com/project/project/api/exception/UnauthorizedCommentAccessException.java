package com.project.project.api.exception;

public class UnauthorizedCommentAccessException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
	public UnauthorizedCommentAccessException(String message) {
		super(message);
	}
	
}
