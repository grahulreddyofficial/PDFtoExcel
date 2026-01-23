import ConverterIcon from "./assets/converter.svg?react";
import { SendQuery, Download } from "./services/api";
import { useState } from "react";

function QueryBox() {
  const [status, setStatus] = useState("idle");

  window.onload = function() {
  const res = fetch(
    "https://pdftoexcel-sfij.onrender.com/"
  );
  if (!res.ok) {
    setStatus("ServerNotActive");
  }
  else if(res.ok){
    setStatus("ServerActive");
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setStatus("loading");

    try {
      const data = await SendQuery(formData);
      console.log("Success:", data);
      setStatus("generated");
      Download(data.id);
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("Upload failed");
    } 
  };

  return (
    <>  
        <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="uq-back">
              <input className="upload-box" type="file" name="files" multiple required disabled={status === "loading"} />
              <textarea name="query" id="user-query" placeholder="Write Your Query here..."  required disabled={status === "loading"}></textarea>
          </div>
          <button type="submit" className="send-btn" id="send-query" disabled={status === "loading"}>
              <ConverterIcon width="35px" height="35px" className="convert-icon"/>
              {status === "idle" && "Convert To Excel"}
              {status === "ServerNotActive" && "Server Activating Wait 50 seconds!!!"}
              {status === "ServerActive" && "Convert To Excel"}
              {status === "loading" && "Generating..."}
              {status === "generated" && "Download"}
              {status === "error" && "Failed ❌"}
          </button>
        </form>
    </>
  )
}

export default QueryBox;