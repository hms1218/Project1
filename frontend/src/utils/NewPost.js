const NewPost = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now - createdDate) / (1000 * 60 * 60); // ms → h
    return diffInHours < 12; // 12시간 이내면 새 글
}

export default NewPost;