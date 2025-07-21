import "./FileUpload.css"
import { deleteFile } from "../api/FileApi";
import { useState } from "react";

// const API_BASE_URL = "http://13.124.166.21:8081";
const API_BASE_URL = "http://localhost:8081";

const FileUpload = ({files, setFiles}) => {

    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        if(selectedFiles.length === 0) return;

        setUploading(true);

        try {
            // const uploaded = await uploadFiles(selectedFiles);

            const newFiles = selectedFiles.map((url, index) => ({
                id: null,
                name: selectedFiles[index].name,
                url
            }));
            setFiles(prev => [...prev, ...newFiles]);
        } catch (error) {
            alert("파일 업로드 실패");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = async (index) => {
        if(window.confirm("삭제하시겠습니까?")){
            const fileDelete = files[index];
            try {
                if(fileDelete.id){
                    await deleteFile(fileDelete.id);
                }
                setFiles(prev => prev.filter((_, i) => i !== index));
            } catch (error) {
                alert("파일 삭제 실패")
            }
        }
    };

    const handleRemoveAllFiles = async () => {
        if(window.confirm("모두 삭제하시겠습니까?")){
            try {
                for(const file of files){
                    if(file.id){
                        await deleteFile(file.id);
                    }
                }
                setFiles([]);
            } catch (error) {
                alert("파일 삭제 실패")
            }
        }
        
    }

    return(
        <div className="file-upload-container">
            <input
                type="file"
                onChange={handleFileChange}
                multiple
                disabled={uploading}
            />
            {files.length > 0 && (
                <button type="button" onClick={handleRemoveAllFiles} className="remove-all-button">모두 삭제</button>
            )}
            <div className="file-preview">
                <h3>첨부파일</h3>
                {files.length > 0 ? (
                <ul>
                    {files.map(file => {
                        const fileNameOnly = file.fileName || file.name;
                        const fileUrl = file.url
                        ? URL.createObjectURL(file.url)
                        : `${API_BASE_URL}/uploads/${file.filePath?.split('\\').pop()}`;

                        return (
                            <li key={file.fileId}>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    {fileNameOnly}
                                </a>
                                <button type="button" onClick={() => handleRemoveFile(files.indexOf(file))}>
                                    삭제
                                </button>
                            </li>
                        );
                    })}
                </ul>
                ) : (
                    <p className="no-files-message">첨부된 파일이 없습니다.</p>
                )
            }
            </div>
        </div>
    )
}

export default FileUpload;