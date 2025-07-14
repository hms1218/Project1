import { use, useState } from "react";
import { useNavigate } from "react-router-dom";

//비밀번호 찾기
const FindPw = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!id){
            setError("아이디를 입력해주세요.");
            setMessage('');
            return;
        }

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

        //백연동 후 실제 비밀번호 찾기 부분
        setError('');
        setMessage("비밀번호 재설정 링크가 이메일로 발송되었습니다. 이메일을 확인해주세요.")
    }

    return(
        <div className="container">
            <h2>비밀번호 찾기</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <input 
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디를 입력해주세요."
                    />
                </div>
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
                <button type="submit">비밀번호 찾기</button>
                <p>
                    아이디를 잊으셨나요?{' '}
                    <span onClick={() => navigate("/find-id")}>아이디 찾기로 이동</span>
                </p>
            </form>
        </div>
    )
}

export default FindPw;