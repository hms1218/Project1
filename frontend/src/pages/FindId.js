import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css"
import { findUserIdByEmail } from "../api/UserApi";

//아이디 찾기
const FindId = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email){
            setError("이메일을 입력해주세요.");
            setMessage('');
            return;
        }

        if(!emailRegex.test(email)){
            setError("올바른 이메일 형식이 아닙니다.");
            setMessage('');
            return;
        }

        try {
            setError('');
            const data = await findUserIdByEmail(email);
            setMessage(`가입된 아이디는 ${data.userId}입니다.`);
        } catch (error) {
            console.log("error:", error)
            const message = error.response?.data?.message || "등록된 아이디가 없습니다.";
            setError(message);
            setMessage('');
        }
    }

    return(
        <div className="container">
            <h2>아이디 찾기</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <input 
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력해주세요."
                    />
                </div>
                {error && <p style={{ color: "red", fontSize: "14px", textAlign: "left" }}>{error}</p>}
                {message && <p style={{ color: "green", fontSize: "14px", textAlign: "left" }}>{message}</p>}
                <button type="submit">아이디 찾기</button>
                <p>
                    아이디를 찾으셨나요?{' '}
                    <span onClick={() => navigate("/signin")}>로그인으로 이동</span>
                </p>
                {/* <p>
                    비밀번호를 잊으셨나요?{' '}
                    <span onClick={() => navigate("/find-pw")}>비밀번호 찾기로 이동</span>
                </p> */}
            </form>
        </div>
    )
}

export default FindId;