import { useEffect, useState } from "react";
import PostList from "../components/PostList";

//메인 홈
const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
    // 더미 데이터
        setPosts([
        { id: 1, title: '타이틀1', author: '관리자', date: '2025-07-12' },
        { id: 2, title: '타이틀2', author: '관리자', date: '2025-07-11' },
        ]);
    }, []);

    return(
        <div>
            {/* <img src={mainImage} alt="main_image" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}/> */}
            <h2>최신게시글</h2>
            <PostList posts={posts} />
        </div>
    )
}

export default Home;