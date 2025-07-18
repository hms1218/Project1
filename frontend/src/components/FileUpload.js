import "./FileUpload.css"
import { uploadFiles, deleteFile } from "../api/FileApi";
import { useState } from "react";

const FileUpload = ({files, setFiles}) => {

    const [uploading, setUploading] = useState(false);

    console.log("file", files)

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        if(selectedFiles.length === 0) return;

        setUploading(true);

        try {
            const uploaded = await uploadFiles(selectedFiles);

            const uploadedFiles = uploaded.map((url, index) => ({
                id: null,
                name: selectedFiles[index].name,
                url
            }));
            setFiles(prev => [...prev, ...uploadedFiles]);
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
                {files.length > 0 ? (
                files.map((file,index) => (
                    <div key={index} className="file-item">
                        <span>{file.name}</span>
                        <button type="button" onClick={() => handleRemoveFile(index)}>삭제</button>
                    </div>
                ))
                ) : (
                    <p className="no-files-message">첨부된 파일이 없습니다.</p>
                )
            }
            </div>
        </div>
    )
}

export default FileUpload;