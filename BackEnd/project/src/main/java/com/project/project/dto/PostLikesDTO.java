package com.project.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostLikesDTO {
	private int likes;
	
	@JsonProperty("isLiked")
	private boolean isLiked;
}
