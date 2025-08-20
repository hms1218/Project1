import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { validateResetToken, resetPassword } from "../../api/UserApi";

const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPw, setNewPw] = useState('');
    const [newPwConfirm, setNewPwConfirm] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwConfirmError, setPwConfirmError] = useState('');
    const [isPwValid, setIsPwValid] = useState(false);
    const [isPwConfirmValid, setIsPwConfirmValid] = useState(false);

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
    }, [token])

    const validatePw = (value) => {
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,16}$/;
        if (!pwRegex.test(value)) {
            setPwError("비밀번호는 8~16자의 영문 대/소문자, 숫자를 사용해주세요.");
            setIsPwValid(false);
        } else {
            setPwError("사용 가능한 비밀번호입니다.");
            setIsPwValid(true);
        }
    }

    useEffect(() => {
        if (newPwConfirm === "") {
            setPwConfirmError("");
            setIsPwConfirmValid(false);
            return;
        }

        if (newPwConfirm !== newPw) {
            setPwConfirmError("비밀번호가 일치하지 않습니다.");
            setIsPwConfirmValid(false);
        } else {
            setPwConfirmError("비밀번호가 일치합니다.");
            setIsPwConfirmValid(true);
        }
    }, [newPw, newPwConfirm]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPw || !newPwConfirm) {
            setError("비밀번호를 모두 입력해주세요.");
            return;
        }

        if (newPw !== newPwConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await resetPassword(token, newPw);
            alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
            setMessage(
                <span>
                    비밀번호 변경 완료! {' '}
                    <a href="/signin" style={{ color: 'blue', textDecoration: 'underline' }}>
                        로그인 창으로 이동
                    </a>
                </span>
            );
            setError('');
        } catch (error) {
            setError("비밀번호 변경 중 오류가 발생했습니다.")
        }

    }

    if (loading) {
        return <div>로딩 중...</div>
    }

    return (
        <div className="container">
            <h2>비밀번호 재설정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <input
                        type="password"
                        value={newPw}
                        onChange={(e) => {
                            setNewPw(e.target.value);
                            validatePw(e.target.value);
                            setError('');
                        }}
                        placeholder="새 비밀번호를 입력하세요."
                    />
                    {pwError && <p style={{ color: isPwValid ? 'green' : 'red', fontSize: '14px' }}>{pwError}</p>}
                </div>
                <div className="form_group">
                    <input
                        type="password"
                        value={newPwConfirm}
                        onChange={(e) => {
                            setNewPwConfirm(e.target.value);
                            setError(''); // 입력 시작 시 에러 초기화
                        }}
                        placeholder="새 비밀번호를 다시 입력하세요."
                    />
                    {pwConfirmError && <p style={{ color: isPwConfirmValid ? 'green' : 'red', fontSize: '14px' }}>{pwConfirmError}</p>}
                </div>
                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                {message && <p style={{ color: 'green', fontSize: '14px' }}>{message}</p>}
                <button className="form-button" type="submit">비밀번호 변경</button>
            </form>
        </div>
    )
}

export default ResetPassword;