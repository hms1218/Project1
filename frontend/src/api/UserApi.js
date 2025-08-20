import axios from "axios";
import { API_BASE_URL } from "./BaseUrl";

//회원가입 api
export const signUpApi = async (data) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/users/signup`, data);
        return res.data;
    } catch (error) {
        console.log("회원가입 실패", error);
        throw error;
    }
}

//로그인 api
export const signInApi = async (data) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/users/signin`, data);
        console.log("login: ",res.data)

        // 토큰과 userId localStorage에 저장
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        return res.data;
    } catch (error) {
        console.log("로그인 실패", error);
        throw error;
    }
}

//아이디 중복확인 api
export const checkIdDuplicate = async (userId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/users/check-id`, { params : {userId}})
        return res.data;
    } catch (error) {
        console.error("아이디 중복 검사 실패", error);
        return false;
    }
}

//아이디 찾기
export const findUserIdByEmail = async (email) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/users/find-id`, { params : {email}})
        return res.data;
    } catch (error) {
        console.error("아이디 찾기 실패", error);
        throw error;
    }
}

//비밀번호 찾기
export const requestPasswordReset = async (email) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/users/find-pw`, null, {
            params: { email }
        });
        return res.data;
    } catch (error) {
        console.error("비밀번호 찾기 실패", error)
        throw error;
    }   
};

//비밀번호 토큰 검증
export const validateResetToken = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/users/validate-reset-token`, {
            params: { token }
        });
        return res.data;
    } catch (error) {
        console.error("토큰 검증 실패", error);
        throw error;
    }

};

//비밀번호 재설정
export const resetPassword = async (token, newPassword) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/users/reset-password`, null, {
            params: { token, newPassword }
        });
        return res.data;
    } catch (error) {
        console.error("비밀번호 재설정 실패", error)
        throw error;
    }   
};

//이력서 전송
export const sendResume = async (email) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/users/send-resume`, { email });
        return res.data;
    } catch (error) {
        console.error("이력서 전송 실패",error)
        throw error; 
    }    
};

// 내 정보 가져오기
export const getMyInfo = async () => {
    try {
        const token = localStorage.getItem("token"); // JWT 가져오기
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data; // { userNo, userId, email, createdAt }
    } catch (error) {
        console.error("내 정보 조회 실패", error);
        throw error;
    }
};