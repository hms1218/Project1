import axios from "axios";

// const API_BASE_URL = "http://13.124.166.21:8081";
const API_BASE_URL = "http://localhost:8081";

// 특정 게시글의 댓글 목록 조회
export const getCommentsByPostId = async (postId) => {
    const response = await axios.get(`${API_BASE_URL}/comments/${postId}`);
    return response.data;
};

// 댓글 작성
export const addComment = async (postId, content, userId) => {
    const response = await axios.post(`${API_BASE_URL}/comments/${postId}`, null, {params: { content, userId }});
    return response.data;
};

// 댓글 수정
export const updateComment = async (commentId, content, userId) => {
    const response = await axios.put(`${API_BASE_URL}/comments/${commentId}`, { content }, { params: { userId } } 
    );
    return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId, userId) => {
    const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {params: { userId }});
    return response.data;
};