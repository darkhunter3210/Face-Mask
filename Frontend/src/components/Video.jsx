import React, { useState } from 'react'
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Button } from './Button';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css'
import Loader from "react-loader-spinner";
import Carousel from 'react-elastic-carousel';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'chart.js/auto';
import "./Video.css"

export default function Video() {
    const [Video, setVideo] = useState({ preview: "", raw: "" });
    const [predictedVideo, setPredictedVideo] = useState({imgByteCode: "", maskCount: 0, noMaskCount: 0});
    const [loading, setLoading] = useState(false);
    const [errMesg, setErrMesg] = useState("");

    const resetState = () =>
    {
        setVideo({
            preview: "", raw: "" 
        })
        setPredictedVideo({imgByteCode: "", maskCount: 0, noMaskCount: 0})
        setLoading(false)
    }

    const MyUploader = () => {
        // specify upload params and url for your files
        const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
        
        // called every time a file's `status` changes
        const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
        
        // receives array of files that are done uploading when submit button is clicked
        const handleSubmit = async(files, allFiles) => {
            setErrMesg("");
            setLoading(true); 
            let form_data = new FormData();
            const temp = files[0].file
            const temp_two = URL.createObjectURL(temp)
            setVideo({
                raw : temp,
                preview : temp_two
            })
            
            console.log(files)
            console.log(files[0].file)
            form_data.append('media', files[0].file);

    
            let url = 'http://localhost:5000/video_test';
        
            await axios
              .post(url, form_data, {
                headers: {
                  'content-type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': '*',
                },
              })
              .then(res => {
                console.log('Response:', res)
                console.log('data:', res.data)
                setPredictedVideo({
                    imgByteCode: res.data, 
                    maskCount: 50, 
                    noMaskCount: 20
                });
                setErrMesg("");
              })              
              .catch(err => {
                setErrMesg("Failed to predict");
                setLoading(false);
              });
            
              setTimeout(() => {
                setLoading(false);
              }, 3000);
          allFiles.forEach(f => f.remove())
        }
        return (
            <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            maxFiles={1}
            accept="video/*"
            />
            )
        }

    return (
        <div className="Video" id="Video" style={{width: '100%', height:'min-content',minHeight:'100vh'}}>
            <div className="title">
                <h1>Video Uploader</h1>
                <h3>Upload any Videos and we will predict the mask</h3>
            </div>
            {
                (() => {
                    if (loading)
                        return <div className="container">
                                <div className="Loading-Mesg">
                            <Loader type="Rings" color="#00BFFF" height={200} width={200} />
                            Processing
                        </div>
                        </div>
                    else if (loading === false && predictedVideo.imgByteCode == false)
                    {
                        return <div className="container">
                            <div className="drop-zone">
                                <MyUploader/>
                            </div>
                        </div>
                    }
                    else if (loading === false && predictedVideo.imgByteCode)
                    {
                        return <div className="predicted-trim" >
                            <Carousel>
                            <div>
                                <h1> Original </h1>
                                <img src={Video.preview} alt="dummy" width="800" height="400" />
                            </div>
                            <div>
                                <h1> Prediction </h1>
                                <img src={`data:Video/jpeg;base64,${predictedVideo.imgByteCode}`} alt="dummy" className="pred-img" width="800" height="400"/>
                            </div>
                            <div>
                                <h1>Bar Graph</h1>
                            <Bar
                            data={{
                                labels:['Count'], 
                                datasets:[
                                    {
                                        label: 'Mask',
                                        data: [predictedVideo.maskCount,],
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
                                        data: [predictedVideo.noMaskCount],
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
                            height={400}
                            width={800}
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
                        </Carousel>
                        <Button
                        className='btns'
                        buttonStyle='btn--outline-two'
                        buttonSize='btn--large'
                        path="#Video"
                        onClick={resetState}
                    >Reset</Button>
                </div>
                    }
                })()
            }

            {errMesg ? (
                <div className="Err-Mesg">
                    {errMesg}
                </div>
                ) : (
                <>
                </>
            )}
            

        </div>
    )
}
