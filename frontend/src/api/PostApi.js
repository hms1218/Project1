import axios from "axios";

// const API_BASE_URL = "http://13.124.166.21:8081";
const API_BASE_URL = "http://localhost:8081";

// 게시글 전체 조회
export const getAllPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
};

// 게시글 단건 조회
export const getPostById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
    return response.data;
};

//조회수 증가
export const increaseViewCount = async (id) => {
    try {
        console.log("조회수 증가 요청 시작", id);
        await axios.post(`${API_BASE_URL}/posts/${id}/view`);
        console.log("조회수 증가 요청 완료", id);
    } catch (error) {
        console.error("조회수 증가 실패", error);
    }
};

// 게시글 작성
export const createPost = async (postData, userId) => {
    const response = await axios.post(`${API_BASE_URL}/posts`, postData, {params: { userId }});
    return response.data;
};

// 게시글 수정
export const updatePost = async (id, postData, userId) => {
    const response = await axios.put(`${API_BASE_URL}/posts/${id}`, postData, {params: { userId }});
    return response.data;
};

// 게시글 삭제
export const deletePost = async (id, userId) => {
    const response = await axios.delete(`${API_BASE_URL}/posts/${id}`, {params: { userId }});
    return response.data;
};

// 게시글 좋아요
export const likesPost = async (id, userId) => {
    const response = await axios.post(`${API_BASE_URL}/posts/${id}/likes`, null, {params: {userId}});
    return response.data;
};

// 게시글 좋아요 여부 조회
export const checkIfLiked = async (id, userId) => {
    const response = await axios.get(`${API_BASE_URL}/posts/${id}/liked`, {params: { userId }});
    return response.data;  // true or false
};