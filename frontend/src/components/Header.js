import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import "./Header.css"
import { useState } from "react";

// 메인헤더
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const { userId, logout } = useAuth();

    console.log("userId : ",userId)

    const handleLogout = () => {
        if(window.confirm("로그아웃 하시겠습니까?")){
            logout();
            alert("로그아웃 되셨습니다.");
        }
    }

    return(
        <header className="header">
            <div className="logo-container">
                <h1><Link to="/">LOGO</Link></h1>
            </div>
            <div className="nav-center">
                <Link to="/">홈</Link>
                <Link to="/about">소개</Link>
                <Link to="/board">게시판</Link>
            </div>
            <div className="nav-right">
                {userId ? (
                    <>
                        <div className="desktop-menu">
                            <Link to="/mypage">마이페이지</Link>
                            <button onClick={handleLogout}>로그아웃</button>
                            <span style={{color: userId === "rhkwmq93" && 'red'}}>{userId === "rhkwmq93" ? "관리자계정" : userId}</span>
                        </div>

                        <button className="hamburger-btn" onClick={toggleMenu}>
                        ☰
                        </button>
                        {menuOpen && (
                        <div className="mobile-menu">
                            <span style={{color: userId === "rhkwmq93" && 'red'}}>{userId === "rhkwmq93" ? "관리자계정" : userId}</span>
                            <Link to="/mypage">마이페이지</Link>
                            <button onClick={handleLogout}>로그아웃</button>
                        </div>
                        )}
                    </>
                ) : (
                    <>
                        <Link to='/signin'>로그인</Link>
                        <Link to='/signup'>회원가입</Link>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header;