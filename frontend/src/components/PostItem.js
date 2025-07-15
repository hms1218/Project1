import { Link } from "react-router-dom"

// 게시글 형태
const PostItem = ({post}) => {
    return(
        <tr>
            <td>{post.id}</td>
            <td style={{textAlign: "left"}}>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
            </td>
            <td>{post.author}</td>
            <td>{post.view}</td>
            <td>{post.date}</td>
        </tr>
    )
}

export default PostItem;