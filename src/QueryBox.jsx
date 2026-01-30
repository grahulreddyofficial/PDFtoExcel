import ConverterIcon from "./assets/converter.svg?react";
import { SendQuery, Download } from "./services/api";
import { useState } from "react";

function QueryBox() {
  const [status, setStatus] = useState("idle");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files.length === 1 ? files[0].name : `${files.length} files selected`);
    } else {
      setFileName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setStatus("loading");

    try {
      const data = await SendQuery(formData);
      console.log("Success:", data);
      setStatus("generated");
      
      // Add a small delay before download for better UX
      setTimeout(() => {
        Download(data.id);
      }, 300);
    } catch (err) {
      console.error(err);
      setStatus("error");
      
      // Reset to idle after showing error
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } 
  };

  const getButtonText = () => {
    switch(status) {
      case "loading":
        return "Generating...";
      case "generated":
        return "✓ Download Ready";
      case "error":
        return "Failed - Retry";
      default:
        return "Convert To Excel";
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="uq-back">
        <div className="file-upload-wrapper">
          <input 
            className="upload-box" 
            type="file" 
            name="files" 
            multiple 
            required 
            disabled={status === "loading"}
            onChange={handleFileChange}
            aria-label="Upload files"
          />
          {fileName && (
            <div className="file-name-display">
              📎 {fileName}
            </div>
          )}
        </div>
        
        <textarea 
          name="query" 
          id="user-query" 
          placeholder="Describe what you want to extract or convert..."  
          required 
          disabled={status === "loading"}
          aria-label="Enter your query"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className={`send-btn ${status}`}
        disabled={status === "loading"}
        aria-label={getButtonText()}
      >
        <ConverterIcon width="28px" height="28px" className="convert-icon"/>
        <span>{getButtonText()}</span>
      </button>
    </form>
  )
}

export default QueryBox;