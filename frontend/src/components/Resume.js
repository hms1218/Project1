import { sendResume } from "../api/UserApi";
import { useState } from "react";
import "../pages/sign/Form.css"

const Resume = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendResume = async () => {
        if (!email.trim()) {
            alert("이메일을 입력해주세요.");
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
                onClick={handleSendResume}
                style={{ padding: "6px", marginLeft: "5px" }}
            >
                {loading ? "발송중" : "발송"}
            </button>
        </div>
    );
}

export default Resume;