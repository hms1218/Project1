import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Write.css"
import MyEditor from "./MyEditor";
import FileUpload from "../../components/FileUpload";
import { createPost } from "../../api/PostApi";
import { useAuth } from "../../context/AuthContext";

const PostWrite = () => {

    const navigate = useNavigate();
    const { userId } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);

    const handleSubmit = async (e) => {
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

        const confirmed = window.confirm("작성하시겠습니까?")
        if(!confirmed) return;

        try {
            const user_id = userId;
            await createPost(newPost, user_id);

            alert("게시글이 작성되었습니다.");
            navigate("/board");
        } catch (error) {
            console.error(error);
            alert("게시글 작성 중 오류가 발생했습니다.");
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
                <MyEditor className="editor" content={content} setContent={setContent} />

                <FileUpload className="file-upload-container" files={files} setFiles={setFiles} />

                <div className="write-button-group">
                    <button type="submit">작성</button>
                    <button type="button" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    )
}

export default PostWrite;