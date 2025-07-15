import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateResetToken, resetPassword } from "../api/UserApi";

const ResetPassword = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPw, setNewPw] = useState('');
    const [newPwConfirm, setNewPwConfirm] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                await validateResetToken(token);
                setLoading(false);
            } catch (error) {
                setError("유효하지 않거나 만료된 링크입니다.");
                setLoading(false);
            }
        }
        checkToken();
    },[token])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!newPw || !newPwConfirm){
            setError("비밀번호를 모두 입력해주세요.");
            return;
        }

        if(newPw !== newPwConfirm){
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await resetPassword(token, newPw);
            alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
            navigate("/signin");
        } catch (error) {
            setError("비밀번호 변경 중 오류가 발생했습니다.")
        }

    } 

    if(loading){
        return <div>로딩 중...</div>
    }

    // if(error){
    //     return <div>{error}</div>
    // }

    return(
        <div className="container">
            <h2>비밀번호 재설정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <input
                        type="password"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="새 비밀번호를 입력하세요."
                    />
                </div>
                <div className="form_group">
                    <input
                        type="password"
                        value={newPwConfirm}
                        onChange={(e) => setNewPwConfirm(e.target.value)}
                        placeholder="새 비밀번호를 다시 입력하세요."
                    />
                </div>
                {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
                {message && <p style={{color: 'green', fontSize: '14px'}}>{message}</p>}
                <button type="submit">비밀번호 변경</button>
            </form>
        </div>
    )
}

export default ResetPassword;