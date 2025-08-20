import { Link } from "react-router-dom"
import { FormatDateOnly } from "../utils/FormatDate";
import "../pages/board/Board.css"
import NewPost from "../utils/NewPost";

// 게시글 형태
const PostItem = ({post, number, currentPage}) => {
    const ADMIN_ID = "rhkwmq93";

    return(
        <tr>
            <td>{number}</td>
            <td style={{textAlign: "left"}}>
                <Link to={`/post/${post.postId}?page=${currentPage}`}>{post.title} {NewPost(post.createdAt) && (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                            🆕
                        </span>
                    )}</Link>
            </td>
            <td>{post.author === ADMIN_ID ? "관리자" : post.author}</td>
            <td>{post.view}</td>
            <td>{FormatDateOnly(post.updatedAt ?? post.createdAt)}</td>
        </tr>
    )
}

export default PostItem;