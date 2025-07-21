import { sendResume } from "../api/UserApi";
import { useState } from "react";
import "../pages/sign/Form.css"
import { useAuth } from "../context/AuthContext";

const Resume = () => {
    const { userId } = useAuth();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendResume = async () => {
        if(userId === null){
            alert("로그인 후 이용해주세요.");
            return;
        }

        if (!email.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        const confirmed = window.confirm(`${email} 으로 이력서를 전송하시겠습니까?`);
        if (!confirmed) return;

        try {
            setLoading(true);
            const response = await sendResume(email);
            alert(response);
        } catch (error) {
            console.error(error);
            alert("이력서 발송 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
            setEmail('');
        }
    };

    return (
        <div className="container">
            <h2>이력서 메일 발송</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                style={{ padding: "8px", width: "75%" }}
            />
            <button
                className="resume-button"
                onClick={handleSendResume}
            >
                {loading ? "발송중" : "발송"}
            </button>
        </div>
    );
}

export default Resume;