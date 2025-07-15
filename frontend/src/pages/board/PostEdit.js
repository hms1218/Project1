import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Edit.css";
import MyEditor from "./MyEditor";

const mockPosts = Array.from({ length: 137 }, (_, index) => ({
    id: index + 1,
    title: `Mock Post ${index + 1}`,
    author: 'minseok',
    date: '2025-07-15',
    content: '에러 내용 및 해결 방법',
    view: 0,
    likes: 0,
}));

const PostEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const post = mockPosts.find(post => post.id === parseInt(id));

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if(post){
            setTitle(post.title);
            setContent(post.content);
        }
    }, [post]);

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

        const updatedPost = {
            ...post,
            title,
            content,
        };

        console.log("수정된 게시글:", updatedPost);

        // 추후 API 연동으로 서버에 저장
        // await axios.post("/api/posts", newPost);
        const confirmed = window.confirm("수정하시겠습니까?")
        if(confirmed){
            navigate(`/post/${id}`);
        }
    }

    const handleCancel = () => {
        const confirmed = window.confirm("작성 중인 내용이 삭제됩니다. 취소하시겠습니까?");
        if (confirmed) {
            navigate(`/post/${id}`);
        }
    }

    return(
        <div className="edit-container">
            <h2>게시글 수정</h2>
            <form className="edit-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                />
                <MyEditor content={content} setContent={setContent} />
                <div className="edit-buttons">
                    <button type="submit">수정</button>
                    <button type="button" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    )
}

export default PostEdit;