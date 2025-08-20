import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Detail.css"
import { getPostById, likesPost, deletePost, checkIfLiked, increaseViewCount } from "../../api/PostApi";
import { getCommentsByPostId, addComment, updateComment, deleteComment } from "../../api/CommentApi";
import { FormatDate } from "../../utils/FormatDate";
import { getFilesById } from "../../api/FileApi";
import { API_BASE_URL } from "../../api/BaseUrl";

// 게시글 상세페이지
const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const page = params.get("page") || 1;

    const { userId } = useAuth();
    const ADMIN_ID = "rhkwmq93";

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [comment, setComment] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState('')

    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const getPost = async () => {
            try {
                let viewedPosts = {};
                try {
                    viewedPosts = JSON.parse(localStorage.getItem("viewedPosts")) || {};
                } catch (e) {
                    viewedPosts = {};
                }
                console.log("viewedPosts: ", viewedPosts)

                const idStr = String(id);
                const VIEW_LIMIT = 1000 * 60 * 60;

                if (!(idStr in viewedPosts) || (Date.now() - viewedPosts[idStr]) > VIEW_LIMIT) {
                    await increaseViewCount(id);

                    viewedPosts[idStr] = Date.now();
                    localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
                }

                const res = await getPostById(id);
                setPost(res);
                setLikes(res.likes);

                if (userId) {
                    const liked = await checkIfLiked(id, userId);
                    setIsLiked(liked)
                }

                const getComments = await getCommentsByPostId(id);
                setComment(getComments);

                const fileList = await getFilesById(id);
                setFiles(fileList);

                console.log("fileList:", fileList)

                setLoading(false);
            } catch (error) {
                setError("게시글 조회 실패");
                setLoading(false);
            }
        }
        getPost();
    }, [id, userId])

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>게시글이 없습니다.</p>;

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (newComment.trim() === '') return;

        if (userId === null) {
            alert("로그인 후 이용하세요.")
            return;
        }

        if (!window.confirm("댓글을 등록하시겠습니까?")) return;
        try {
            await addComment(id, newComment, userId);
            const updatedComments = await getCommentsByPostId(id);
            setComment(updatedComments);
            setNewComment("");
        } catch (error) {
            console.error(error);
            alert("댓글 작성 실패");
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            await deleteComment(commentId, userId);
            const updatedComments = await getCommentsByPostId(id);
            setComment(updatedComments);
            alert("삭제되었습니다.")
        } catch (error) {
            console.error(error);
            alert("댓글 삭제 실패");
        }
    }

    const handleDelete = async () => {
        if (window.confirm("삭제하시겠습니까?")) {
            try {
                console.log("삭제 요청 userId:", userId);
                await deletePost(id, userId);
                alert("삭제되었습니다.")
                navigate("/board")
            } catch (error) {
                console.error(error);
                alert("삭제 실패");
            }

        }
    }

    //댓글 수정
    const startEditing = (commentId, currentContent) => {
        setEditCommentId(commentId);
        setEditContent(currentContent);
    };

    const cancelEditing = () => {
        setEditCommentId(null);
        setEditContent("");
    };

    const submitEdit = async () => {
        if (editContent.trim() === "") {
            alert("내용을 입력해주세요.");
            return;
        }

        if (!window.confirm("댓글을 수정하시겠습니까?")) return;

        try {
            await updateComment(editCommentId, editContent, userId);
            const updatedComments = await getCommentsByPostId(id);
            setComment(updatedComments);
            setEditCommentId(null);
            setEditContent("");
            alert("댓글이 수정되었습니다.");
        } catch (error) {
            console.error(error);
            alert("댓글 수정 실패");
        }
    };

    const handleLikes = async () => {
        if (!userId) {
            alert("로그인 후 이용하세요.");
            return;
        }
        try {
            const updatedLikes = await likesPost(id, userId);
            setLikes(updatedLikes);
            const liked = await checkIfLiked(id, userId);
            setIsLiked(liked);
        } catch (error) {
            console.error(error);
            alert("좋아요 처리 실패");
        }
    }

    console.log("등록시간:", post.createdAt);
    console.log("수정시간:", post.updatedAt);

    return (
        <div className="detail-container">
            <h1>{post.title}</h1>
            <p className="detail-meta">
                작성자 : {post.author === ADMIN_ID ? "관리자" : post.author} |
                작성일 : {FormatDate(post.updatedAt ?? post.createdAt)} {post.updatedAt && <>(수정됨)</>} |
                조회수 : {post.view} |
                추천수 : {likes}</p>
            <hr />
            <div
                className="detail-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="detail-button">
                {(post && (post.author === userId || userId === ADMIN_ID)) && (
                    <>
                        <button onClick={() => navigate(`/post/${id}/edit`)}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                )}
                <button onClick={handleLikes} className={isLiked ? "liked-button" : ""}>👍추천</button>
                <button onClick={() => navigate(`/board?page=${page}`)}>목록으로</button>
            </div>
            <hr />

            <div className="file-list">
                <h3>첨부파일</h3>
                {files.length === 0 && <p>첨부파일이 없습니다.</p>}
                <ul>
                    {files.map(file => {
                        const fileNameOnly = file.filePath.split('\\').pop();
                        const fileUrl = `${API_BASE_URL}/uploads/${fileNameOnly}`;

                        return (
                            <li key={file.fileId}>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    📎{file.fileName}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <p className="detail-comment">댓글({comment.length})</p>
            <ul className="comment-list">
                {comment.map(comment => (
                    <li key={comment.commentId}>
                        <div className="comment-header">
                            <strong>{comment.author}</strong>
                            <div className="comment-actions">
                                <span className="comment-time">{FormatDate(comment.updatedAt ?? comment.createdAt)} {comment.updatedAt && <>(수정됨)</>}</span>
                                {(comment.author === userId || userId === ADMIN_ID) && editCommentId !== comment.commentId && (
                                    <>
                                        <button onClick={() => startEditing(comment.commentId, comment.content)}>수정</button>
                                        <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                                    </>
                                )}
                            </div>
                        </div>
                        {editCommentId === comment.commentId ? (
                            <>
                                <input
                                    className="comment-edit-input"
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <div className="comment-edit-buttons">
                                    <button onClick={submitEdit}>저장</button>
                                    <button onClick={cancelEditing} style={{ marginLeft: "10px" }}>취소</button>
                                </div>
                            </>
                        ) : (
                            <p className="comment-content">{comment.content}</p>
                        )}
                    </li>
                ))}
            </ul>
            <form className="comment-form" onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                    placeholder="댓글을 입력하세요."
                />
                <button type="submit">등록</button>
            </form>
        </div>
    )
}

export default PostDetail;