import PostList from "../../components/PostList";
import { useNavigate } from "react-router-dom";
import "./Board.css"
import { useEffect, useState } from "react";
import { getAllPosts } from "../../api/PostApi";
import { useAuth } from "../../context/AuthContext";

const Board = () => {

    const navigate = useNavigate();
    const { userId } = useAuth();

    const [posts, setPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1); //현재 페이지
    const postsPerPage = 10; //한 페이지에 보여줄 게시글 수
    const pagesPerGroup = 5;

    const totalPages = Math.ceil(posts.length / postsPerPage); //전체 페이지 수

    const indexOfLastPost = currentPage * postsPerPage; //현재 페이지의 마지막 게시글 번호
    const indexOfFirstPost = indexOfLastPost - postsPerPage; //현재 페이지의 첫번째 게시글 번호
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); //현재 페이지의 게시글 수

    const currentGroup = Math.ceil(currentPage / pagesPerGroup); //현재 페이징 그룹
    const startPage = (currentGroup - 1) * pagesPerGroup + 1; //그룹의 첫번째페이지
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages); //그룹의 마지막페이지

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await getAllPosts();

                const sortedPosts = res.sort((a, b) => {
                    const dateA = new Date(a.updatedAt || a.createdAt);
                    const dateB = new Date(b.updatedAt || b.createdAt);
                    return dateB - dateA; // 최신순
                });

                setPosts(sortedPosts);
            } catch (error) {
                console.error("게시글 조회 실패",error);
            }
        }
        getPosts();
    },[])

    const handlePrevGroup = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextGroup = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i+8);
    }

    return(
        <div className="board-container">
            <h2>게시판</h2>
            <div className="post-write">
                <button onClick={() => {
                    if(userId === null){
                        alert("로그인 후 이용해주세요.")
                        return;
                    }
                    navigate("/write")}
                    }>글쓰기</button>
            </div>
            <PostList posts={currentPosts} currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length}/>

            <div className="pagination">
                <button onClick={handlePrevGroup} disabled={currentPage === 1}>
                    &lt;
                </button>

                {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                    const pageNumber = startPage + idx;
                    return (
                        <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={currentPage === pageNumber ? "active" : ""}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button onClick={handleNextGroup} disabled={totalPages === currentPage}>
                    &gt;
                </button>
            </div>
        </div>
    )
}

export default Board;