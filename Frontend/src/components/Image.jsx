import React, { useState } from 'react'
import axios from 'axios';
import "./Image.css"

export default function Image() {
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [predictedImage, setPredictedImage] = useState({url: ""});
    const [loading, setLoading] = useState(false);
    const [errMesg, setErrMesg] = useState("");

    const handleImageChange = e => {
        if (e.target.files.length) {
          setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: e.target.files[0]
          });
        }
    };

    const handlePrediction = e => {
        e.preventDefault();
        setErrMesg("");
        setLoading(true); 

        let form_data = new FormData();

        form_data.append('image', image.raw);

        let url = 'http://localhost:5000/predict_img';
    
        axios
          .post(url, form_data, {
            headers: {
              'content-type': 'multipart/form-data',
              'Access-Control-Allow-Origin': '*',
            },
          })
          .then(res => {
            setPredictedImage({url: res.data.predImage});  
            setErrMesg("");
            setLoading(false);     
          })
          .catch(err => {
            setErrMesg("Failed to predict");
            setLoading(false);
          });
      }

    return (
        <div className="image" id="image">
            <input className="fileInput" 
                type="file" 
                onChange={handleImageChange}
                accept="image/png, image/jpeg" 
            />
            <button className="submit-btn" 
                type="submit" 
                onClick={handlePrediction}>
                Run Prediction
            </button>

            {image.preview ? (
                <div className="preview-img">
                    <h1> Original </h1>
                    <img src={image.preview} alt="dummy" width="800" height="400" />
                </div>
                ) : (
                <>
                </>
            )}

            {loading ? (
                <div className="Loading-Mesg">
                    Processing
                </div>
                ) : (
                <>
                </>
            )}

            {errMesg ? (
                <div className="Err-Mesg">
                    {errMesg}
                </div>
                ) : (
                <>
                </>
            )}
            
            {predictedImage.url ? (
                <div className="predicted-trim">
                    <h1> Prediction </h1>
                    <img src={`data:image/jpeg;base64,${predictedImage.url}`} alt="dummy" className="pred-img" width="800" height="400"/>
                </div>
                ) : (
                <>
                </>
            )}
        </div>
    )
}
