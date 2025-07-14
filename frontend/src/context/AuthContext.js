import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [userId, setUserId] = useState(null);

    const decodeUserIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.sub; // 토큰에서 subject에 userId가 들어있다면
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            const userIdFromToken = decodeUserIdFromToken(token);
            setUserId(userIdFromToken);
        }
    },[])

    //로그아웃 함수
    const logout = () => {
        localStorage.removeItem("token");
        setUserId(null);
    }

    return(
        <AuthContext.Provider value={{userId, setUserId, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);