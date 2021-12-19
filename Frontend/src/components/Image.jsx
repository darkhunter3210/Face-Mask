import React, { useState } from 'react'
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import "./Image.css"

export default function Image() {
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [predictedImage, setPredictedImage] = useState({imgByteCode: "", maskCount: 0, noMaskCount: 0});
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
            setPredictedImage({
                imgByteCode: res.data.predImage, 
                maskCount: res.data.maskCount, 
                noMaskCount: res.data.noMaskCount
            });
            setErrMesg("");
            setLoading(false);     
          })
          .catch(err => {
            setErrMesg("Failed to predict");
            setLoading(false);
          });
      }

    return (
        <div className="image" id="image" style={{width: '100%', height:'min-content',minHeight:'100vh'}}>
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
            
            {predictedImage.imgByteCode ? (
                <div className="predicted-trim" >
                    <h1> Prediction </h1>
                    <img src={`data:image/jpeg;base64,${predictedImage.imgByteCode}`} alt="dummy" className="pred-img" width="800" height="400"/>

                    <Bar
                        data={{
                            labels:['Count'], 
                            datasets:[
                                {
                                    label: 'Mask',
                                    data: [predictedImage.maskCount,],
                                    backgroundColor: [
                                        'rgba(0, 255, 0, .3)',
                                    ],
                                    borderColor:[
                                        'rgba(0, 255, 0, 1)',
                                    ],
                                    borderWidth:1,
                                },
                                {
                                    label: 'No Mask',
                                    data: [predictedImage.noMaskCount],
                                    backgroundColor: [
                                        'rgba(255, 0, 0, .3)',
                                    ],
                                    borderColor:[
                                        'rgba(255, 0, 0, 1)',
                                    ],
                                    borderWidth:1,
                                },
                            ],
                        }}
                        height={100}
                        width={200}
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    }
                                },
                            },
                        }}
                    />
                </div>
                ) : (
                <>
                </>
            )}
        </div>
    )
}
