import cv2 # pip install opencv-python-headless
import numpy as np # pip install numpy
from PIL import Image, ImageDraw, ImageFont # pip install Pillow
import pytesseract # pip install pytesseract
from googletrans import Translator # pip install googletrans==3.1.0a0
import keras_ocr # pip install keras-ocr
import math
import tempfile
import io
import base64



def remove_and_translate_text(image_path):

    image = Image.open(image_path)

    extracted_text = pytesseract.image_to_string(image, lang='eng')

    translator = Translator()
    translated_text = translator.translate(extracted_text, src='en', dest='hi').text

    def midpoint(x1, y1, x2, y2):
        x_mid = int((x1 + x2) / 2)
        y_mid = int((y1 + y2) / 2)
        return (x_mid, y_mid)

    image_format = image.format.lower()

    if image_format in ["jpeg", "jpg", "png"]:
        file_extension = "." + image_format
    else:
        file_extension = ".jpeg"

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_image:
        image.save(temp_image, format=image_format)
        temp_image_path = temp_image.name

    img = keras_ocr.tools.read(temp_image_path)
    pipeline = keras_ocr.pipeline.Pipeline()
    prediction_groups = pipeline.recognize([img])
    mask = np.zeros(img.shape[:2], dtype="uint8")

    for box in prediction_groups[0]:
        x0, y0 = box[1][0]
        x1, y1 = box[1][1]
        x2, y2 = box[1][2]
        x3, y3 = box[1][3]

        x_mid0, y_mid0 = midpoint(x1, y1, x2, y2)
        x_mid1, y_mid1 = midpoint(x0, y0, x3, y3)

        thickness = int(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2))
        cv2.line(mask, (x_mid0, y_mid0), (x_mid1, y_mid1), 255, thickness)

    inpainted_img = cv2.inpaint(img, mask, 7, cv2.INPAINT_NS)
    img_with_text_removed = Image.fromarray(cv2.cvtColor(inpainted_img, cv2.COLOR_BGR2RGB))

    draw = ImageDraw.Draw(img_with_text_removed)
    font_path = "Noto_Sans/NotoSans-Regular.ttf"
    font_size = 30
    font = ImageFont.truetype(font_path, font_size)

    for box in prediction_groups[0]:
        x0, y0 = box[1][0]
    text_position = (x0 + 250, y0 - 250)
    draw.text(text_position, translated_text, fill="red", font=font)

    img_stream = io.BytesIO()
    img_with_text_removed.save(img_stream, format="JPEG")
    binary_image_data = img_stream.getvalue()
    #print("img :",binary_image_data)
    # Encode the binary data as a base64 string
    base64_image_data = base64.b64encode(binary_image_data).decode('utf-8')
    data_url = f"data:image/jpeg;base64,{base64_image_data}"
    return data_url
  
    

# Example usage:
# input_image_path = "ex.jpeg"
# output_image = remove_and_translate_text(input_image_path)
# output_image.show()