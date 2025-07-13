import { useParams } from "react-router-dom";

// 게시글 상세페이지
const PostDetail = () => {
    const {id} = useParams();

    return(
        <div>
            <h1>상세페이지</h1>
            <p>게시글 ID : {id}</p>
        </div>    
    )
}

export default PostDetail;