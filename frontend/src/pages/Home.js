import "./Home.css";
import mainImage from "../assets/mainImage.jpg";
import { useNavigate } from "react-router-dom";

//메인 홈
const Home = () => {

    const navigate = useNavigate();

    return (
        <div className="home-container">
            <img
                src={mainImage}
                alt="Main Banner"
                className="home-banner"
            />
            <h1 className="home-title">환영합니다!</h1>
            <p className="home-description">
                초보 개발자의 에러 파헤치기 ! 같이 공유해요 !
            </p>
            <button
                onClick={() => navigate("/board")}
                className="home-button"
            >
                게시판 바로가기
            </button>
        </div>
    );
};

export default Home;