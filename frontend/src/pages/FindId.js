import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css"

//아이디 찾기
const FindId = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
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

        //백연동 후 실제 아이디 찾기 부분
        setError('');
        setMessage('가입된 아이디는 이메일로 발송되었거나, 관리자에게 문의해주세요.');
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
            </form>
        </div>
    )
}

export default FindId;