import { useState, useEffect } from "react";
import { getMyInfo } from "../api/UserApi";
import "./MyPage.css";
import { FormatDateOnly } from "../utils/FormatDate";

const MyPage = () => {

    // 사용자 정보
    const [userInfo, setUserInfo] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        userId: "",
        email: "",
    });

    // API 사용자 정보 가져오기
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMyInfo();
                console.log("mypageData::", data)
                setUserInfo(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
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
                <h3>작성 글 / 댓글</h3>
                <p>개발 예정...</p>
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
