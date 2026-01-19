from pydantic import BaseModel
from typing import Annotated
from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import uuid 
from pathlib import Path

import agent1
import converter

app = FastAPI()

origins = [
    "https://pdftoexcel-one.vercel.app",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # List of allowed origins
    allow_credentials=True,         # Allow cookies to be included in cross-origin requests
    allow_methods=["*"],            # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],            # Allow all headers
)

UPLOAD_DIR = Path("uploads")

@app.get('/')
async def home():
     return {
          "details": "FastAPI API for the project PDFtoExcel",
          "version": "1.0.0v"
     }

@app.post('/doc-upload')
async def create_file(query: Annotated[str, Form()], files: list[UploadFile]):
        pdf_text = ""
        id = str(uuid.uuid4())
        save_dir = UPLOAD_DIR / id
        save_dir.mkdir(parents=True, exist_ok=True)
        for file in files:
            # Saving Uploaded FIles
            with open(f"uploads/{id}/{file.filename}", "wb") as f:
                f.write(await file.read())
            # Extracting Text from PDF Files
            text = ""
            with pdfplumber.open(f"uploads/{id}/{file.filename}") as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            pdf_text += text

        resposne = agent1.MainAgent1(query, pdf_text)
        converter.formatter(id, resposne)

        return {
             "filename": [file.filename for file in files],
             "query": query,
             "id": id
             }

@app.get("/{id}/download")
async def dwnld(id: str):
    FILE_PATH = Path(f"exports/{id}/generated_excel_sheet.xlsx")

    return FileResponse(path=FILE_PATH, filename="generated_excel_sheet.xlsx", media_type='application/octet-stream')
