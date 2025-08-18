import axios from "axios";
import { API_BASE_URL } from "./BaseUrl";

//파일 업로드
export const uploadFiles = async (files, postId) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file.url));

    formData.append("postId",postId)

    try {
        const res = await axios.post(
            `${API_BASE_URL}/files/upload`,
            formData,
            {
                headers:{
                    // "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            }
        )
        console.log("업로드 성공",res.data)
        return res.data;
    } catch (error) {
        console.error("파일 업로드 실패:", error.response?.data || error.message);
        throw error;
    }
}

//파일 삭제
export const deleteFile = async (fileId) => {
    try {
        await axios.delete(
            `${API_BASE_URL}/files/${fileId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
    } catch (error) {
        console.error("파일 삭제 실패:", error);
        throw error;
    }
}

//파일 조회
export const getFilesById = async (postId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/files/${postId}`);
        return res.data;
    } catch (error) {
        console.error("파일 조회 실패",error);
        throw error;
    }
}