# python -m flask run

from flask import Flask, render_template, Response, send_file, request
from flask_cors import CORS, cross_origin
import torch.backends.cudnn as cudnn
import numpy as np
from PIL import Image
import torch
import pafy
import cv2 
import io
import time
import simplejpeg

app = Flask(__name__)
CORS(app)

cudnn.benchmark = True

model = torch.hub.load('ultralytics/yolov5', 'custom', 'best.pt', force_reload=True)
model.conf = 0.40

url = ''
stream_on = False
def generate_frame_stream():
    # try to find a way to get 720p instead of best maybe?
    camera_source = pafy.new(url).getbest()
    capture = cv2.VideoCapture(camera_source.url)  

    while(stream_on):
        start = time.time()
        #Capture frame-by-frame
        ret, raw_bgr_frame = capture.read()

        #convert bgr to rgb
        pred_frame_rgb = raw_bgr_frame[..., ::-1]

        pred = model(pred_frame_rgb)
        pred_frame = pred.render()[0]

        # only predicted frame
        frame_bytes = simplejpeg.encode_jpeg(pred_frame)
        yield(b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # # original and predicted frames side by side horizontally
        # combined_frame = np.concatenate((raw_rgb_frame, pred_frame), axis=1)
        # combined_frame_bytes = cv2.imencode('.jpg', combined_frame)[1].tobytes()
        # yield(b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + combined_frame_bytes + b'\r\n')

        stop = time.time()
        print("Frame process time: ", stop - start)
    print('exiting loop')    
@app.route('/video_feed',methods=['GET'])
def video_feed():
    """
    Video streaming route. Put this in the src attribute of an img tag.
    URL argument must be included in query parameters
    ie: http://127.0.0.1:5000/video_feed?url={some_youtube_link}
    """
    global url
    global stream_on
    stream_on = True
    url = request.args.get("url")
    return Response(generate_frame_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/stop_feed',methods=['POST'])
@cross_origin()
def stop_feed():
    global stream_on
    stream_on = False
    return Response('Stopped')


@app.route('/predict_img',methods=['POST'])
@cross_origin()
def predict_img():
    """
    Takes in a image, predicts on it, and sends the predicted image back.
    Request format: 
        image: image.png
    """
    start = time.time()
    # Getting the image
    imagefile_bytes = request.files['image'].read()
    print("image successfully uploaded")

    img_numpy_bgr = cv2.imdecode(np.frombuffer(imagefile_bytes, np.uint8), cv2.IMREAD_COLOR)
    img_numpy_rgb = cv2.cvtColor(img_numpy_bgr , cv2.COLOR_BGR2RGB)
    
    pred = model(img_numpy_rgb)
    pred_numpy_img= pred.render()[0]

    # Converts np array of image pixels to png bytecode
    pred_img = Image.fromarray(pred_numpy_img)
    imageio = io.BytesIO()
    pred_img.save(imageio, "PNG", quality=100)
    imageio.seek(0)

    # Response containing predicted image
    response = send_file(imageio, as_attachment=True, attachment_filename='prediction.png', mimetype='image/png')
    return response

if __name__ == "__main__":
    app.run(debug=True, threaded = True)