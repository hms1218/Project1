import { Link } from "react-router-dom"
import { FormatDateOnly } from "../utils/FormatDate";
import "../pages/board/Board.css"
import { useAuth } from "../context/AuthContext";

// 게시글 형태
const PostItem = ({post, number}) => {
    const { userId } = useAuth();

    return(
        <tr>
            <td>{number}</td>
            <td style={{textAlign: "left"}}>
                <Link to={`/post/${post.postId}`}>{post.title}</Link>
            </td>
            <td>{userId === post.author ? "관리자" : post.author}</td>
            <td>{post.view}</td>
            <td>{FormatDateOnly(post.createdAt)}</td>
        </tr>
    )
}

export default PostItem;