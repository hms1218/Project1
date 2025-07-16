import "./FileUpload.css"

const FileUpload = ({files, setFiles}) => {

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        if(window.confirm("삭제하시겠습니까?")){
            setFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleRemoveAllFiles = () => {
        if(window.confirm("모두 삭제하시겠습니까?")){
            setFiles([]);
        }
        
    }

    return(
        <div className="file-upload-container">
            <input
                type="file"
                onChange={handleFileChange}
                multiple
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