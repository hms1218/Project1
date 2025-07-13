import PostItem from "./PostItem";

//게시글 리스트
const PostList = ({posts}) => {
    return(
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </ul>
    )
}

export default PostList;