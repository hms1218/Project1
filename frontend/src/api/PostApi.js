import axios from "axios";
import { API_BASE_URL } from "./BaseUrl";

// 게시글 전체 조회
export const getAllPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
};

// 게시글 단건 조회
export const getPostById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
    console.log("postRe::", response);
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
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/posts/${id}`, 
        postData, 
        {
            params: { userId },
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
};

// 게시글 삭제
export const deletePost = async (id, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/posts/${id}`, 
        {
            params: { userId },
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
};

// 게시글 좋아요
export const likesPost = async (id, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/posts/${id}/likes`, 
        null, 
        {
            params: {userId},
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
};

// 게시글 좋아요 여부 조회
export const checkIfLiked = async (id, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/posts/${id}/liked`, 
        {
            params: { userId },
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;  // true or false
};

//마이페이지 작성한 글 가져오기
export const getMyPosts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/posts/my`, {
        headers: {Authorization: `Bearer ${token}`},
    })

    return res.data;
}

//스크랩 추가
export const addFavorite = (postId) => {
    const token = localStorage.getItem("token");
    console.log("scrapToken:", token)
    return axios.post(
        `${API_BASE_URL}/favorite/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

//스크랩 해제
export const removeFavorite = (postId) => {
    const token = localStorage.getItem("token");
    return axios.delete(
        `${API_BASE_URL}/favorite/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

//스크랩 조회
export const getFavorites = () => {
    const token = localStorage.getItem("token");
    return axios.get(
        `${API_BASE_URL}/favorite`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};