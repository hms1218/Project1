import Resume from "../components/Resume";
import "../pages/sign/Form.css"

// 소개페이지
const About = () => {
    return(
        <div className="container">
            <h2>소개페이지</h2>
            <p>저의 이력서입니다.</p>
            <p>궁금하시다면 이메일을 입력 후 "이력서 발송" 버튼을 클릭하세요.</p>
            <Resume />
        </div>
    )
}

export default About;