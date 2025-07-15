import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Detail.css"

const mockPosts = Array.from({ length: 137 }, (_, index) => ({
    id: index + 1,
    title: `Mock Post ${index + 1}`,
    author: 'minseok',
    date: '2025-07-15',
    content: '에러 내용 및 해결 방법',
    view: 0,
    likes: 0,
}));

const mockComments = Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    postId: index + 1, // 각 댓글이 다른 postId를 갖도록, 필요 시 원하는 번호로 고정 가능
    author: ['jihyun', 'alex', 'choi'][index],
    content: [
        '좋은 글 감사합니다!',
        '많이 배우고 갑니다.',
        'JWT 이해가 잘 됐어요!'
    ][index],
}));

// 게시글 상세페이지
const PostDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();

    const post = mockPosts.find(post => post.id === parseInt(id));
    const [comment, setComment] = useState(mockComments.filter(c => c.postId === parseInt(id)));
    const [newComment, setNewComment] = useState('');

    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        if(newComment.trim() === '') return;

        const nextComment = {
            id : comment.length + 1,
            postId : post.id,
            author : userId ? userId : "익명",
            content : newComment,
        }

        setComment([...comment, nextComment]);
        setNewComment('');
    }

    const handleDelete = () => {
        if(window.confirm("삭제하시겠습니까?")){
            alert("삭제되었습니다.")
            navigate("/board")
        }
    }

    const handleLikes = () => {
        if(isLiked){
            setLikes(prev => prev - 1);
        } else{
            setLikes(prev => prev + 1);
        }
        setIsLiked(prev => !prev)
    }

    return(
        <div className="detail-container">
            <h1>{post.title}</h1>
            <p className="detail-meta">작성자 : {post.author} | 작성일 : {post.date} | 조회수 : {post.view} | 추천수 : {likes}</p>
            <hr/>
            <p className="detail-content">{post.content}</p>
            <div className="detail-button">
                <button onClick={() => navigate(`/post/${id}/edit`)}>수정</button>
                <button onClick={handleDelete}>삭제</button>
                <button onClick={handleLikes} className={isLiked ? "liked-button" : ""}>👍추천</button>
                <button onClick={() => navigate("/board")}>목록으로</button>
            </div>
            <hr/>
            <p className="detail-comment">댓글({comment.length})</p>
            <ul className="comment-list">
                {comment.map(comment => (
                    <li key={comment.id}>
                        <strong>{comment.author}</strong> 4분 전
                        <p>{comment.content}</p>
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