import React, { useEffect, useState, useContext } from 'react';
import edit_channel_icon from '../icon/edit_channel_icon.svg';

import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component//navbar/Navbar';
import Preview from '../component/preview/Preview';
import Alert from '../component/form/Alert';
import ButtonLoader from '../component/loader/ButtonLoader';
import SuccessInfo from '../component/form/SuccessInfo';
import {AppContext} from '../context/AppContext';
import { API } from '../config/api';

const EditChannel = () => {
    const [state, dispatch] = useContext(AppContext);
    const [cover, setCover] = useState('Cover');
    const [photo, setPhoto] = useState('Upload Photo');
    const [preview, setPreview] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        status: false,
        message: ""
    });

    const reader = new FileReader();

    

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        chanelName: "",
        description: "",
        cover: "",
        photo: ""
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const coverFile = React.useRef();
    const photoFile = React.useRef();


    const handleCoverInputClick = () => {
        setError({
            ...error,
            status: false
        });
        setSuccess(false);
        coverFile.current.click();
    }

    const handleCoverInputChange = (event) => {
        if(event.target.files[0]){
            setCover(event.target.files[0].name);
            setFormData({
                ...formData,
                [event.target.name] : event.target.files[0]
            });

            
            reader.readAsDataURL(event.target.files[0])
            reader.onloadend = () => {
                setPreview({
                    ...preview, 
                    cover: reader.result
                });
        }
            
        } else {
            setCover('Cover');
        }
        
    }

    const handlePhotoInputClick = () => {
        setError({
            ...error,
            status: false
        });
        setSuccess(false);
        photoFile.current.click();
    }

    const handlePhotoInputChange = (event) => {
        if(event.target.files[0]){
            setPhoto(event.target.files[0].name);
            setFormData({
                ...formData,
                [event.target.name] : event.target.files[0]
            })

            reader.readAsDataURL(event.target.files[0])
            reader.onloadend = () => {
                setPreview({
                    ...preview,
                    photo: reader.result
                });
        }

           
        } else {
            setPhoto('Upload Photo');
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

    const getChanelById = async () => {
        try {
            
            const response = await API.get(`/chanel/${currentUser.id}`);

            if(response.status !== 200){
                setError(true);
                return;
            }

            const chanel = response.data.data.chanel;

            setFormData({
                ...formData,
                email: chanel.email,
                password: chanel.password,
                chanelName: chanel.chanelName,
                description: chanel.description,           
            });


            setPreview({
                ...preview,
                cover: JSON.parse(chanel.cover).path,
                photo: JSON.parse(chanel.photo).path
            });
    

            
        } catch(err){
            console.log(err);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError({
            ...error,
            status: false
        });
        setSuccess(false);
        setLoading(true);

        const body = new FormData();
        body.append('email', formData.email );
        body.append('password', formData.password);
        body.append('chanelName', formData.chanelName);
        body.append('description', formData.description);
        
        if(coverFile.current.files[0]){
            body.append('cover', formData.cover);
        }

        if(photoFile.current.files[0]){
            body.append('photo', formData.photo);
        }

        const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
        };

        try {
            const response = await API.put(`/chanel/${currentUser.id}`, body, config);

            if(response.data.status !== "success"){
                setSuccess(false);
                
                setError({
                    ...error,
                    status: true,
                    message: response.data.error.message
                });
                setLoading(false);
                return;
            }

            setLoading(false);
            setSuccess(true);
            setError({
                status: false,
                message: ''
            })
            setPhoto('Upload Photo');
            setCover('Cover');

            const user = await API.get('/auth');
            if(user.data.status !== 'success'){
                return dispatch({
                    type: 'AUTH_ERROR'
                })
            };

            dispatch({
                type: 'LOAD_USER',
                payload: user.data.data.user
            })
           
        } catch(err){
            setLoading(false);
            console.log(err);
        }
    }

    useEffect(() => {
        getChanelById();
        
    },[]);

    return(
        <div className="wrapper">
            <Sidebar />
            <div className="container">
                <Navbar />
                <div className="form-container">
                    <h1>Edit Channel</h1>
                    {success && (<SuccessInfo message="Channel has been changed successfully" />)}
                    {error.status && (<Alert status="error-info" message={error.message} />)}
                    <form onSubmit={handleSubmit}>
                        <div className="inline-input">
                            <input 
                                type="text" 
                                placeholder="Name Channel" 
                                name="chanelName" 
                                value={formData.chanelName} 
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            <div className="file-upload" onClick={handleCoverInputClick}>
                                <label>{cover}</label>
                                <input 
                                    type="file" 
                                    ref={coverFile} 
                                    onChange={handleCoverInputChange} 
                                    name="cover"
                                />
                                <img src={edit_channel_icon} alt="icon"/>    
                            </div>
                        </div>
                        <textarea 
                            placeholder="Description" 
                            name="description" 
                            value={formData.description}
                            onChange={handleChange}
                        >
                        </textarea>
                        <div className="input-file-container">
                            <div className="input-file" onClick={handlePhotoInputClick}>
                                <label>{photo}</label>
                                <input type="file" ref={photoFile} onChange={handlePhotoInputChange} name="photo"/>
                                <img src={edit_channel_icon} alt="icon"/>    
                            </div>
                        </div>
                        <Preview data={preview} />
                        <button className="button">
                            {loading ? (
                                <ButtonLoader />
                            ): ("Save")}
                        </button>
                        
                    </form>
                </div>
            </div>

        </div>
        
    )
}

export default EditChannel;