import React, { useState } from 'react'
import './Stream.css'
import  axios from 'axios'
export default function Stream() {

    const [url, setUrl] = useState("");
    const [showStream, setShowStream] = useState(false)

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
        console.log(url)
    };
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log('http://127.0.0.1:5000/video_feed?url='+url);
            setShowStream(true);
        }
    }

    const handleStopbutton = (e) =>{
        axios.post('http://127.0.0.1:5000/stop_feed').then(res => console.log(res.data))
        console.log('pressed')
        setShowStream(false);
    }

    const handleTest = (e) =>{
        axios.get('http://127.0.0.1:5000/analytics').then(res => console.log(res.data))
        console.log('pressed')
    }   

    return (
        <>
            <div className="stream" id="stream">
                <label>
                    Youtube URL:
                    <input type="text" value={url} onChange={handleUrlChange} id="youtube-url-field" onKeyDown={handleKeyDown}/>
                    <button onClick={handleTest}>Test</button>
                    
                </label>
                {/* <button class='stop' onClick={handleStopbutton}>Stop</button> */}
                {showStream ? 
                    ( <>
                        <button class='stop' onClick={handleStopbutton}>Stop</button>
                        <img src={'http://127.0.0.1:5000/video_feed?url='+url}  width="600" height="360"/>
                    </>  
                    ) 
                    : 
                    (<></>)
                }
            </div>
        </>
    )
}
