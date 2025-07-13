import { Link } from "react-router-dom"

// 게시글 형태
const PostItem = ({post}) => {
    return(
        <div className="post-item">
            <Link to={`/post/${post.id}`} className="post-title">
                {post.title}
            </Link>
            <div className="post-meta">
                작성자: {post.author} | {post.date}
            </div>
        </div>
    )
}

export default PostItem;