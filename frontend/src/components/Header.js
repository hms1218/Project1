import { Link } from "react-router-dom"

// 메인헤더
const Header = () => {
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
                <Link to='/signin'>로그인</Link>
                <Link to='/signup'>회원가입</Link>
            </nav>
        </header>
    )
}

export default Header;