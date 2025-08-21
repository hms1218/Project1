import axios from "axios";
import { API_BASE_URL } from "./BaseUrl";

// 특정 게시글의 댓글 목록 조회
export const getCommentsByPostId = async (postId) => {
    const response = await axios.get(`${API_BASE_URL}/comments/${postId}`);
    return response.data;
};

// 댓글 작성
export const addComment = async (postId, content, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/comments/${postId}`, 
        null, 
        {
            params: { content, userId },
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
};

// 댓글 수정
export const updateComment = async (commentId, content, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/comments/${commentId}`, 
        { content }, 
        { 
            params: { userId },
            headers: { Authorization: `Bearer ${token}` }
        } 
    );
    return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, 
        {
            params: { userId },
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
};

//마이페이지 작성한 댓글 가져오기
export const getMyComments = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/comments/my`, {
        headers: { Authorization: `Bearer ${token}`},
    })
    return res.data;
}