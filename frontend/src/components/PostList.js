import PostItem from "./PostItem";
import "../pages/board/Board.css"

//게시글 리스트
const PostList = ({posts, currentPage, postsPerPage, totalPosts}) => {
    return(
        <table className="post-table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>등록일</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post, index) => {
                    const number = totalPosts - ((currentPage - 1) * postsPerPage + index);
                    return <PostItem key={post.postId} post={post} number={number}/>;
                })}
            </tbody>
        </table>
    )
}

export default PostList;