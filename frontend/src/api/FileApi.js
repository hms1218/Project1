import axios from "axios";

const API_BASE_URL = "http://13.124.166.21:8081";
// const API_BASE_URL = "http://localhost:8081";

//파일 업로드
export const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
        const res = await axios.post(
            `${API_BASE_URL}/files/upload`,
            formData,
            {
                headers:{
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            }
        )
        return res.data;
    } catch (error) {
        console.error("파일 업로드 실패:", error);
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