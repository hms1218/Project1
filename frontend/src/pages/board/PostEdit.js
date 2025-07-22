import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Edit.css";
import MyEditor from "./MyEditor";
import FileUpload from "../../components/FileUpload";
import { useAuth } from "../../context/AuthContext";
import { getPostById, updatePost } from "../../api/PostApi";
import { getFilesById, uploadFiles } from "../../api/FileApi";

const PostEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const getPost = async () => {
            try {
                const post = await getPostById(id);
                setTitle(post.title);
                setContent(post.content);
                
                const fileList = await getFilesById(id);
                setFiles(fileList);
            } catch (error) {
                console.error(error);
                alert("게시글 정보를 불러오는 데 실패했습니다.");
                navigate("/board");
            }
        }
        getPost();
    }, [id, navigate]);

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

        console.log("content length:", content.length); 

        const confirmed = window.confirm("수정하시겠습니까?");
        if(!confirmed) return;
        
        try {
            const updatedPost = { title, content };
            await updatePost(id, updatedPost, userId);

            const newFiles = files.filter(file => file.id === null);
                if (newFiles.length > 0) {
                    await uploadFiles(newFiles, id);
                }

            alert("게시글이 수정되었습니다.");
            navigate(`/post/${id}`);
        } catch (error) {
            console.error(error);
            alert("게시글 수정 중 오류가 발생했습니다.");
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
                <MyEditor className="editor" content={content} setContent={setContent} />

                <FileUpload className="file-upload-container" files={files} setFiles={setFiles} />

                <div className="edit-buttons">
                    <button type="submit">수정</button>
                    <button type="button" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    )
}

export default PostEdit;