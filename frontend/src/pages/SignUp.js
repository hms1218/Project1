import { useState } from "react"
import { useNavigate } from "react-router-dom";

// 회원가입 페이지
const SignUp = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [email, setEmail] = useState('');
    
    const [idError, setIdError] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwConfirmError, setPwConfirmError] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateId = (value) => {
        const idRegex = /^[a-z][a-z0-9]{4,14}$/;
        if(!idRegex.test(value)){
            setIdError("아이디는 영문자로 시작하는 5~15자여야 합니다.")
        } else {
            setIdError('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <div className="container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <label>아이디</label>
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value)
                            validateId(e.target.value)
                        }}
                        placeholder="아이디를 입력해주세요."
                    />
                    { idError && <p style={{ color: "red", fontSize: "14px" }}>{idError}</p> }
                </div>
                <div className="form_group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        placeholder="비밀번호를 입력해주세요."
                    />
                    { pwError && <p style={{ color: "red", fontSize: "14px" }}>{pwError}</p> }
                </div>
                <div className="form_group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        name="pwConfirm"
                        value={pwConfirm}
                        onChange={(e) => setPwConfirm(e.target.value)}
                        placeholder="비밀번호를 재입력해주세요."
                    />
                    { pwConfirmError && <p style={{ color: "red", fontSize: "14px" }}>{pwConfirmError}</p> }
                </div>
                <div className="form_group">
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력해주세요."
                    />
                    { emailError && <p style={{ color: "red", fontSize: "14px" }}>{emailError}</p> }
                </div>
                <div>
                    <button type="submit">가입</button>
                    <button onClick={() => navigate("/")}>취소</button>
                </div>
            </form>
        </div>
    )
}

export default SignUp;