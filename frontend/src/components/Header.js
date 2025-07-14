import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext";

// 메인헤더
const Header = () => {

    const { userId, logout } = useAuth();

    console.log("userId : ",userId)

    const handleLogout = () => {
        if(window.confirm("로그아웃 하시겠습니까?")){
            logout();
            alert("로그아웃 되셨습니다.");
        }
    }

    return(
        <header>
            <h1>LOGO</h1>
            <div className="main_search">
                <input type="text" placeholder="검색어를 입력해주세요." style={{width: '90%', height: '80%'}}/>
                <button>검색</button>
            </div>
            <nav>
                <Link to="/">홈</Link>
                <Link to="/about">소개</Link>
                <Link to="/board">게시판</Link>
                {userId ? (
                    <>
                        <span>안녕하세요, {userId}님</span>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to='/signin'>로그인</Link>
                        <Link to='/signup'>회원가입</Link>
                    </>
                )
                }
                
            </nav>
        </header>
    )
}

export default Header;