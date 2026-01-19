import os
from dotenv import load_dotenv
from pathlib import Path
import json
from google import genai

def MainAgent1(user_query, extracted_pdf_text):
    def load_prompt(filename: str) -> str:
        prompt_path = Path("prompts") / filename
        return prompt_path.read_text(encoding="utf-8")

    load_dotenv()
    client = genai.Client(api_key=os.getenv("API_KEY"))

    system_prompt = load_prompt("system_v1.txt")
    prompt = user_query
    pdftext = extracted_pdf_text

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[
            "system: " + system_prompt,  
            "user: " + prompt,
            "PDF Text: " + pdftext
            ]
    )

    response_text = json.loads(response.text)

    return response_text