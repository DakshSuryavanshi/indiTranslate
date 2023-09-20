from flask import Flask, render_template, request, jsonify, Response
from googletrans import Translator
import os
from docx import Document
from PyPDF2 import PdfReader
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

app = Flask(__name__, static_folder="static", static_url_path="/static")
translator = Translator()


def convert_to_text(file):
    text = ""

    if file.filename.endswith(".pdf"):
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    elif file.filename.endswith(".docx"):
        doc = Document(file)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    elif file.filename.endswith(".txt"):
        text = file.read()
        text = text.decode("utf-8")
    return text


@app.route("/", methods=["GET", "POST"])
def translate_text():
    return render_template("index.html")


@app.route("/extract", methods=["POST"])
def extract_text():
    if request.method == "POST":
        if "file" in request.files:
            file = request.files["file"]
            if file.filename == "":
                return jsonify({"output": "No file selected"})

            _, file_extension = os.path.splitext(file.filename)

            if file_extension in (".pdf", ".docx", ".txt"):
                extracted_text = convert_to_text(file)
                return jsonify(
                    {"extracted_text": extracted_text}
                )  # Return extracted text as JSON
            else:
                return jsonify({"output": "Unsupported file type"})
    else:
        return jsonify({"output": "Error"})


@app.route("/translate", methods=["POST"])
def translate():
    if request.method == "POST":
        text = request.form.get("leftext")
        output_lang_code = request.form.get("output_lang")
        input_lang_code = request.form.get("target_lang")
        output = Translator().translate(
            text, src=input_lang_code, dest=output_lang_code
        )
        # Return the translation result as JSON
        return jsonify({"output": output.text})
    else:
        return jsonify({"output": "Error"})


# Function to convert text to PDF
def text_to_pdf(text):
    output_pdf_path = "output.pdf"

    c = canvas.Canvas(output_pdf_path, pagesize=letter)
    c.setFont("Helvetica", 12)
    # pdfmetrics.registerFont(TTFont("NotoSans", "path/to/NotoSans-Regular.ttf"))  # Replace with the actual font path, https://www.google.com/get/noto/
    # c.setFont("NotoSans", 12)  # Use the registered font
    lines = text.split("\n")

    for line in lines:
        c.drawString(100, 700, line)
        c.showPage()

    c.save()

    return output_pdf_path


# Route to handle text-to-PDF conversion
@app.route("/convert_to_pdf", methods=["POST"])
def convert_to_pdf():
    if request.method == "POST":
        text = request.form.get("output-text")

        if text:
            pdf_path = text_to_pdf(text)
            return jsonify({"pdf_path": pdf_path})

    return jsonify({"output": "Error"})


# Route to download the generated PDF
@app.route("/download_pdf", methods=["GET"])
def download_pdf():
    pdf_path = "output.pdf"
    with open(pdf_path, "rb") as pdf_file:
        pdf_data = pdf_file.read()

    response = Response(pdf_data, content_type="application/pdf")
    response.headers["Content-Disposition"] = "attachment; filename=output.pdf"

    return response


if __name__ == "__main__":
    app.run(debug=True, port=8001)
