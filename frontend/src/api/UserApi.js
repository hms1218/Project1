import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

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
    const res = await axios.post(`${API_BASE_URL}/users/find-pw`, null, {
        params: { email }
    });
    return res.data;
};

//비밀번호 토큰 검증
export const validateResetToken = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/users/validate-reset-token`, {
        params: { token }
    });
    return res.data;
};

//비밀번호 재설정
export const resetPassword = async (token, newPassword) => {
    const res = await axios.post(`${API_BASE_URL}/users/reset-password`, null, {
        params: { token, newPassword }
    });
    return res.data;
};