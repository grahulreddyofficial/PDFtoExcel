export async function SendQuery(formData) {
  const res = await fetch("http://localhost:8000/doc-upload", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json(); // { id: "session_id" }
}

export async function Download(sessionId) {
  const res = await fetch(
    `http://localhost:8000/${sessionId}/download`
  );

  if (!res.ok) {
    throw new Error("Download failed");
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "converted.xlsx"; // filename
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}
