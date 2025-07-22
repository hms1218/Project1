import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const MyEditor = ({content, setContent, className}) => {

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "link",
        "image",
    ];

    return (
        <ReactQuill
            className={className}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="내용을 입력해주세요."
        />
    );
}

export default MyEditor;