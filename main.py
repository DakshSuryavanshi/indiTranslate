from flask import Flask, render_template, request, jsonify
from googletrans import Translator

app = Flask(__name__, static_folder="static", static_url_path="/static")
translator = Translator()


@app.route("/", methods=["GET", "POST"])
def translate_text():
    return render_template("index.html")


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


if __name__ == "__main__":
    app.run(debug=True, port=8001)