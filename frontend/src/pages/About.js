import Resume from "../components/Resume";
import "../pages/sign/Form.css"

// 소개페이지
const About = () => {
    return(
        <div className="container">
            <h2>소개페이지</h2>
            <p>관리자의 이력서입니다.</p>
            <p>본인 이메일을 입력 후 "발송" 버튼을 클릭하세요.</p>
            <Resume />
        </div>
    )
}

export default About;