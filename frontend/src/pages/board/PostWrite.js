import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Write.css"
import MyEditor from "./MyEditor";

const PostWrite = () => {

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (title.trim() === "") {
            alert("제목을 입력해주세요.");
            return;
        }

        if(content.trim() === ""){
            alert("내용을 입력해주세요.");
            return;
        }

        const newPost = {title, content};

        console.log("작성된 게시글:", newPost);

        // 추후 API 연동으로 서버에 저장
        // await axios.post("/api/posts", newPost);
        const confirmed = window.confirm("작성하시겠습니까?")
        if(confirmed){
            navigate("/board");
        }
    }

    const handleCancel = () => {
        const confirmed = window.confirm("작성 중인 내용이 삭제됩니다. 목록으로 돌아가시겠습니까?");
        if (confirmed) {
            navigate("/board");
        }
    }

    return(
        <div className="write-container">
            <h2>글쓰기</h2>
            <form className="write-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해주세요."
                />
                <MyEditor content={content} setContent={setContent} />
                <div className="write-button-group">
                    <button type="submit">작성</button>
                    <button type="button" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    )
}

export default PostWrite;