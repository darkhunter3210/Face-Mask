import React, { useState } from 'react'
import './Stream.css'
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

    return (
        <>
            <div className="stream" id="stream">
                <label>
                    Youtube URL:
                    <input type="text" value={url} onChange={handleUrlChange} id="youtube-url-field" onKeyDown={handleKeyDown}/>
                </label>
                {showStream ? 
                    (
                        <img src={'http://127.0.0.1:5000/video_feed?url='+url}  width="600" height="360"/>
                    ) 
                    : 
                    (<></>)
                }
            </div>
        </>
    )
}
