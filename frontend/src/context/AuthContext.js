import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    const decodeUserIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.sub; // 토큰에서 subject에 userId가 들어있다면
        } catch {
            return null;
        }
    };

    const isTokenExpired = (token) => {
        if (!token) return true;

        try {
            const decoded = jwtDecode(token);
            // exp는 초 단위, 현재시간은 밀리초 단위이므로 1000 곱하기
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true; // 파싱 실패시 만료로 간주
        }
    };

    // useCallback으로 logout 고정
    const logout = useCallback((isSessionExpired = false) => {
        localStorage.removeItem("token");
        setUserId(null);
        navigate("/")
        if (isSessionExpired) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            navigate("/signin");
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("token:", token)
        if (token) {
            if (isTokenExpired(token)) {
                logout(true);
            } else {
                const userIdFromToken = decodeUserIdFromToken(token);
                setUserId(userIdFromToken);
            }
        }
    }, [logout])

    return (
        <AuthContext.Provider value={{ userId, setUserId, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);