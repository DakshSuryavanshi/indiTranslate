from flask import Flask, render_template, request, jsonify
from googletrans import Translator

app = Flask(__name__, static_folder='static', static_url_path='/static')
translator = Translator()

@app.route('/', methods=['GET', 'POST'])
def translate_text():
    
    return render_template('index.html')

@app.route('/abc', methods=['POST'])
def transalate():
    if request.method == "POST":
        print("cool")
        text = request.form.get('leftext')
        print(text)
        # target_lang = request.form.get('target_lang')
        target_lang = "hi"
        print("lang", target_lang)
        output = Translator().translate(text, dest=target_lang)
        print("text here:", output.text)
        return render_template('index.html',output=output.text)
    else:
        return render_template('index.html',output=output.text)

if __name__ == '__main__':
    app.run(debug=True, port=8001)