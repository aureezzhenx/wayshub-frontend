import '../App.css';

import React, { useState, useEffect } from 'react';
import attach_thumbnail from '../icon/attach_thumbnail.png';
import add_video_icon_active from '../icon/add_video_icon_active.svg';

import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component//navbar/Navbar';

import Alert from '../component/form/Alert';
import ButtonLoader from '../component/loader/ButtonLoader';
import SuccessInfo from '../component/form/SuccessInfo';
import ProgressBar from '../component/progressbar/ProgressBar';

import { API } from '../config/api';

const AddVideo = () => {
    const [thumbnail, setThumbnail] = useState('Attach Thumbnail');
    const [video, setVideo] = useState('Upload Video');
    const [progres, setProgres] = useState(0);

    const thumbnailFile = React.useRef();
    const videoFile = React.useRef();

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        status: false,
        message: ""
    });

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
        video: ""
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const handleThumbnailInputClick = () => {
        thumbnailFile.current.click();
    }

    const handleThumbnailInputChange = (event) => {
        
        if(event.target.files[0]){
            setThumbnail(event.target.files[0].name);
            setFormData({
                ...formData,
                [event.target.name] : event.target.files[0]
            })
        } else {
            setThumbnail('Attach Thumbnail');
        }
    }

    const handleVideoInputClick = () => {
        videoFile.current.click();
    }

    const handleVideoInputChange = (event) => {
        if(event.target.files[0]){
            setVideo(event.target.files[0].name);
            setFormData({
                ...formData,
                [event.target.name] : event.target.files[0]
            })
        } else {
            setVideo('Upload Video');
        }
    }

    const handleChange = (event) => {
        setSuccess(false);
        setError({
            ...error,
            status: false
        });
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        });
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
        setError({
            ...error,
            status: false
        });
        setSuccess(false);
        setLoading(true);

        const body = new FormData();
        body.append('title', formData.title );
        body.append('description', formData.description);
        
        if(thumbnailFile.current.files[0]){
            body.append('thumbnail', formData.thumbnail);
        }

        if(videoFile.current.files[0]){
            body.append('video', formData.video);
        }

        const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
            onUploadProgress: (event)=> {
                const {loaded, total} = event;
                let percent = Math.floor( (loaded * 100) / total )
                setProgres(percent);
            }
        };

        try {
            const response = await API.post('/video', body, config);

            if(response.data.status !== "success"){
                setSuccess(false);
                
                setError({
                    ...error,
                    status: true,
                    message: response.data.error.message
                });

                console.log(response.data.error);

                setProgres(0);
                setLoading(false);

                return;
            }

            setFormData({
                title: "",
                description: "",
                thumbnail: "",
                video: "",
            });

            thumbnailFile.current.value = "";
            videoFile.current.value = "";
            setVideo('Upload Video');
            setThumbnail('Attach Thumbnail');
            setProgres(0);
            setLoading(false);
            setSuccess(true);
           
        } catch(err){
            setProgres(0);
            setLoading(false);
            console.log(err);
        }
    }

    return(
        <div className="wrapper">
            <Sidebar/>
            <div className="container">
                <Navbar/>
                {loading && (<ProgressBar message={progres} />)}
                <div className="form-container">
                    <h1>Add Video</h1>
                    {success && (<SuccessInfo message="Video added successfully" />)}
                    {error.status && (<Alert status="error-info" message={error.message} />)}
                    <form onSubmit={handleSubmit}>
                        <div className="inline-input">
                            <input 
                                type="text" 
                                placeholder="Title"
                                name="title"
                                autoComplete="off"
                                onChange={handleChange}
                                value={formData.title}
                            />
                            <div className="file-upload" onClick={handleThumbnailInputClick}>
                                <label>{thumbnail}</label>
                                <input type="file" ref={thumbnailFile} onChange={handleThumbnailInputChange} name="thumbnail"/>
                                <img src={attach_thumbnail} alt="icon"/>    
                            </div>
                        </div>
                        <textarea 
                            placeholder="Description" 
                            name="description"
                            onChange={handleChange}
                            value={formData.description}
                        >
                        </textarea>
                        <div className="input-file-container">
                            <div className="input-file" onClick={handleVideoInputClick}>
                                <label>{video}</label>
                                <input type="file" ref={videoFile} onChange={handleVideoInputChange} name="video"/>
                                <img src={add_video_icon_active} alt="icon"/>    
                            </div>
                        </div>
                        <button className="button">
                            {loading ? (
                                <ButtonLoader />
                            ): ("Add")}
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
        
    )
}

export default AddVideo;