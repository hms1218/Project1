import PostList from "../../components/PostList";
import { useNavigate } from "react-router-dom";
import "./Board.css"
import { useState } from "react";

const mockPosts = Array.from({ length: 137 }, (_, index) => ({
    id: index + 1,
    title: `Mock Post ${index + 1}`,
    author: 'minseok',
    date: '2025-07-15',
    content: '에러 내용 및 해결 방법',
    view: 0,
    likes: 0,
}));

const Board = () => {

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1); //현재 페이지
    const postsPerPage = 10; //한 페이지에 보여줄 게시글 수
    const pagesPerGroup = 5;

    const totalPages = Math.ceil(mockPosts.length / postsPerPage); //전체 페이지 수

    const indexOfLastPost = currentPage * postsPerPage; //현재 페이지의 마지막 게시글 번호
    const indexOfFirstPost = indexOfLastPost - postsPerPage; //현재 페이지의 첫번째 게시글 번호
    const currentPosts = mockPosts.slice(indexOfFirstPost, indexOfLastPost); //현재 페이지의 게시글 수

    const currentGroup = Math.ceil(currentPage / pagesPerGroup); //현재 페이징 그룹
    const startPage = (currentGroup - 1) * pagesPerGroup + 1; //그룹의 첫번째페이지
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages); //그룹의 마지막페이지

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
                <button onClick={() => navigate("/write")}>글쓰기</button>
            </div>
            <PostList posts={currentPosts} />

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