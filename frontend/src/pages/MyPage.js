import { useState, useEffect } from "react";
import { getMyInfo } from "../api/UserApi";
import "./MyPage.css";
import { FormatDateOnly } from "../utils/FormatDate";
import { getMyPosts, getPostById } from "../api/PostApi";
import { getMyComments } from "../api/CommentApi";
import { Link } from "react-router-dom";

const MyPage = () => {

    // 사용자 정보
    const [userInfo, setUserInfo] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        userId: "",
        email: "",
    });

    const [myPosts, setMyPosts] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [showFull, setShowFull] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

    // API 사용자 정보 가져오기
    useEffect(() => {
        //유저정보
        const fetchUser = async () => {
            try {
                const data = await getMyInfo();
                console.log("mypageData::", data)
                setUserInfo(data);
            } catch (error) {
                console.error(error);
            }
        };

        //작성한 게시글
        const fetchMyPosts = async () => {
            try {
                const data = await getMyPosts();
                console.log("myPosts:::", data);
                setMyPosts(data);
            } catch (error) {
                console.error("내 게시글 불러오기 실패:", error);
            }
        }

        //작성한 댓글
        const fetchMyComments = async () => {
            try {
                // const data = await getMyComments();
                // console.log("MyComments:::", data);
                // setMyComments(data);
                const comments = await getMyComments();
                console.log("comments", comments)

                // 댓글에 postTitle 붙여주기
                const withPosts = await Promise.all(
                    comments.map(async (comment) => {
                        try {
                            console.log("여기까찌?", comment)
                            const post = await getPostById(comment.postId);
                            console.log("post::", post)
                            return { ...comment, postTitle: post.title };
                        } catch {
                            return { ...comment, postTitle: "삭제된 게시글" };
                        }
                    })
                );

                setMyComments(withPosts);
            } catch (error) {
                console.error("내 댓글 불러오기 실패:", error);
            }
        }

        fetchUser();
        fetchMyPosts();
        fetchMyComments();
    }, []);

    const handleUserInfoEdit = () => {
        if (userInfo) {
            setEditData({
                userId: userInfo?.userId || "",
                email: userInfo?.email || ""
            })
        }
        setIsEditing(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSave = () => {
        //수정 api 호출
        setUserInfo((prev) => ({
            ...prev,
            ...editData,
        }))

        setIsEditing(false);

        alert("회원정보가 수정되었습니다!");
    }

    const toggleShowFull = (postId) => {
        setShowFull((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>

            {/* 사용자 정보 */}
            <section className="user-info">
                <h3>회원 정보</h3>
                {isEditing ? (
                    <>
                        <p>
                            아이디: <input name="userId" value={editData.userId} onChange={handleChange} />
                        </p>
                        <p>
                            이메일: <input name="email" value={editData.email} onChange={handleChange} />
                        </p>
                        <button onClick={handleSave}>저장</button>
                        <button onClick={() => setIsEditing(false)}>취소</button>
                    </>
                ) :
                    (
                        <>
                            <p>아이디: {userInfo?.userId}</p>
                            <p>이메일: {userInfo?.email || "-"}</p>
                            <p>가입일: {FormatDateOnly(userInfo?.createdAt) || "-"}</p>
                            <button onClick={handleUserInfoEdit}>회원정보 수정</button>
                        </>
                    )
                }
            </section>

            {/* 비밀번호 변경 */}
            <section className="change-password">
                <h3>비밀번호 변경</h3>
                <button>비밀번호 변경</button>
            </section>

            {/* 작성 글/댓글 */}
            <section className="my-posts">
                {/* 탭 */}
                <div className="tab-titles">
                    <h3
                        className={activeTab === "posts" ? "active-tab" : "tab"}
                        onClick={() => setActiveTab("posts")}
                    >
                        작성 글
                    </h3>
                    <h3
                        className={activeTab === "comments" ? "active-tab" : "tab"}
                        onClick={() => setActiveTab("comments")}
                    >
                        댓글
                    </h3>
                </div>

                {/* 작성 글 */}
                {activeTab === "posts" && (
                    <ol>
                        {myPosts.length === 0 ? (
                            <p>작성한 글이 없습니다.</p>
                        ) : (
                            myPosts.map((post) => {
                                const isLong = post.content.length > 150;
                                const contentPreview = isLong ? post.content.slice(0, 150) + "..." : post.content;

                                return (
                                    <li key={post.postId}>
                                        <h4 className="post-title">
                                            <Link to={`/post/${post.postId}`}>{post.title}</Link>
                                        </h4>
                                        <div className="post-content-wrapper">
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: showFull[post.postId] ? post.content : contentPreview,
                                                }}
                                            />
                                            {isLong && (
                                                <span
                                                    className="show-more-link"
                                                    onClick={() => toggleShowFull(post.postId)}
                                                >
                                                    {showFull[post.postId] ? "접기" : "더보기"}
                                                </span>
                                            )}
                                        </div>
                                        <br />
                                        <small>
                                            조회수: {post.view} | 추천수: {post.likes} | 작성일:{" "}
                                            {FormatDateOnly(post.createdAt)}
                                        </small>
                                    </li>
                                );
                            })
                        )}
                    </ol>
                )}

                {/* 댓글 */}
                {activeTab === "comments" && (
                    <ol>
                        {myComments.length === 0 ? (
                            <p>작성한 댓글이 없습니다.</p>
                        ) : (
                            myComments.map((comment) => (
                                <li key={comment.commentId}>
                                    <p>{comment.content}</p>
                                    <small>
                                        게시글:{" "}
                                        <Link to={`/post/${comment.postId}`}>
                                            {comment.postTitle}
                                        </Link>{" "}
                                        | 작성일: {FormatDateOnly(comment.createdAt)}
                                    </small>
                                </li>
                            ))
                        )}
                    </ol>
                )}
            </section>

            {/* 즐겨찾기 */}
            <section className="favorites">
                <h3>즐겨찾기</h3>
                <p>개발 예정...</p>
            </section>
        </div>
    );
};

export default MyPage;
