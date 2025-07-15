import PostItem from "./PostItem";

//게시글 리스트
const PostList = ({posts}) => {
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
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </tbody>
        </table>
    )
}

export default PostList;