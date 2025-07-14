import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Form.css'
import { signInApi } from "../api/UserApi";
import { useAuth } from "../context/AuthContext";

// 로그인페이지
const SignIn = () => {
    const navigate = useNavigate();

    const { setUserId } = useAuth();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const [isIdValid, setIsIdValid] = useState(false);
    const [isPwValid, setIsPwValid] = useState(false);

    const [Error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(id === ''){
            setError("아이디를 입력해주세요.")
        } else if(pw === ''){
            setError("비밀번호를 입력해주세요.")
        } else{
            setError('')
        }

        try {
            const res = await signInApi({
                userId: id,
                password: pw,
            });
            setUserId(res.userId);
            const token = res.token;
            localStorage.setItem("token", token);
            alert("로그인 성공!");
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "로그인 실패";
            alert(message);
        }
    }

    return(
        <div className="container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <label>아이디</label>
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디를 입력해주세요."
                    />                   
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
                </div>
                { Error && <p style={{ color: "red", fontSize: "14px", textAlign: "left" }}>{Error}</p> }
                <button type="submit">로그인</button>
                <p><span onClick={() => navigate("/find-id")}>아이디 찾기</span>{' '}|{' '}<span onClick={() => navigate("/find-pw")}>비밀번호 찾기</span></p>
                <p>회원이 아니신가요?{' '}<span onClick={() => navigate("/signup")}>회원가입으로 이동</span></p>
            </form>
        </div>
    )
}

export default SignIn;