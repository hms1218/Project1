import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './Form.css'
import { signUpApi, checkIdDuplicate } from "../api/UserApi";

// 회원가입 페이지
const SignUp = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [email, setEmail] = useState('');
    
    const [isIdValid, setIsIdValid] = useState(false);
    const [isPwValid, setIsPwValid] = useState(false);
    const [isPwConfirmValid, setIsPwConfirmValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    
    const [idError, setIdError] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwConfirmError, setPwConfirmError] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateId = async (value) => {
        const idRegex = /^[a-z][a-z0-9]{4,14}$/;
        
        if(!idRegex.test(value)){
            setIdError("아이디는 영문자로 시작하는 5~15자여야 합니다.");
            setIsIdValid(false);
            return;
        } 

        try {
            const res = await checkIdDuplicate(value);
            console.log("res:", res)
            if(res.exists){
                setIdError("이미 사용 중인 아이디입니다.");
                setIsIdValid(false);
            } else{
                setIdError('사용 가능한 아이디입니다.');
                setIsIdValid(true);
            }      
        } catch (error) {
            setIdError("아이디 중복 검사 중 오류가 발생했습니다.");
            setIsIdValid(false);
        }
    }

    const validatePw = (value) => {
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,16}$/;
        if(!pwRegex.test(value)){
            setPwError("비밀번호는 8~16자의 영문 대/소문자, 숫자를 사용해주세요.");
            setIsPwValid(false);
        } else {
            setPwError('사용 가능한 비밀번호입니다.');
            setIsPwValid(true);
        }
    }

    useEffect(() => {
        if (pwConfirm === "") {
            setPwConfirmError("");
            setIsPwConfirmValid(false);
            return;
        }

        if (pwConfirm !== pw) {
            setPwConfirmError("비밀번호가 일치하지 않습니다.");
            setIsPwConfirmValid(false);
        } else {
            setPwConfirmError("비밀번호가 일치합니다.");
            setIsPwConfirmValid(true);
        }
    }, [pw, pwConfirm]);

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(value)) {
            setEmailError("유효한 이메일 형식이 아닙니다.");
            setIsEmailValid(false);
        } else {
            setEmailError("유효한 이메일 형식입니다.");
            setIsEmailValid(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isIdValid || !isPwValid || !isPwConfirmValid || !isEmailValid) {
            alert("입력한 정보를 다시 확인해주세요.");
            return;
        }

        const confirmResult = window.confirm("가입하시겠습니까?");
        
        if (!confirmResult) return;

        try {
            await signUpApi({
                userId: id,
                password: pw,
                email: email,
            });
            alert("가입이 완료되었습니다.");
            navigate("/signin");
        } catch (error) {
            const message = error.response?.data?.message || "회원가입 실패";
            alert(message);
        }
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
                    { idError && <p style={{ color: isIdValid ? "green" : "red", fontSize: "14px", textAlign: "left" }}>{idError}</p> }
                </div>
                <div className="form_group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={pw}
                        onChange={(e) => {
                            setPw(e.target.value)
                            validatePw(e.target.value)
                        }}
                        placeholder="비밀번호를 입력해주세요."
                    />
                    { pwError && <p style={{ color: isPwValid ? "green" : "red", fontSize: "14px", textAlign: "left" }}>{pwError}</p> }
                </div>
                <div className="form_group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        name="pwConfirm"
                        value={pwConfirm}
                        onChange={(e) => {
                            setPwConfirm(e.target.value)
                        }}
                        placeholder="비밀번호를 재입력해주세요."
                    />
                    { pwConfirmError && <p style={{ color: isPwConfirmValid ? "green" : "red", fontSize: "14px", textAlign: "left" }}>{pwConfirmError}</p> }
                </div>
                <div className="form_group">
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            validateEmail(e.target.value)
                        }}
                        placeholder="이메일을 입력해주세요."
                    />
                    { emailError && <p style={{ color: isEmailValid ? "green" : "red", fontSize: "14px", textAlign: "left" }}>{emailError}</p> }
                </div>
                <div>
                    <button type="submit">가입</button>
                </div>
            </form>
        </div>
    )
}

export default SignUp;