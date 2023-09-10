from flask import Flask, render_template, request, jsonify
from googletrans import Translator

app = Flask(__name__, static_folder='static', static_url_path='/static')
translator = Translator()

@app.route('/', methods=['GET', 'POST'])
def translate_text():
    translation = None  # Initialize translation with a default value
    if request.method == 'POST':
        text = request.form.get('text')
        source_lang = request.form.get('source_lang')
        target_lang = request.form.get('target_lang')

        if text and source_lang and target_lang:
            translation = translator.translate(text, src=source_lang, dest=target_lang)

    return render_template('index.html', translation=translation)

if __name__ == '__main__':
    app.run(debug=True, port=8001)

