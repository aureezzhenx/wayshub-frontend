import { useState, useEffect } from 'react';
import '../App.css';
import ChannelHeader from '../component/channel/ChannelHeader';
import ChannelDescription from '../component/channel/ChannelDescription';
import ChannelVideo from '../component/channel/ChannelVideo';
import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component/navbar/Navbar';
import VideoChanelLoader from '../component/loader/VideoChanelLoader';
import EmptyVideo from '../component/video/EmptyVideo';

import { API } from '../config/api';

const MyChannel = () => {
    const [isVideo, setIsVideo] = useState(true);

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chanel, setChanel] = useState([]);
    const [videos, setVideos] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const deleteVideo = async (chanelId) => {
        try {
            setLoading(true);
            const response = await API.delete(`/video/${chanelId}`);

            if(response.data.status !== "success"){
                setLoading(false);
                console.log(response.data.error.message);
                return;
            }
            getChanelById();

        } catch(err){
            console.log(err);
        }
    }
    

    const getChanelById = async () => {
        try {
            setLoading(true);

            const response = await API.get(`/chanel/${currentUser.id}`);

            if(response.data.status !== "success"){
                setLoading(false);
                setError(true);
                return;
            }
            const videosByChanelId = await API.get(`/chanel/${currentUser.id}/videos`);
            
            if(videosByChanelId.data.status !== "success"){
                setLoading(false);
                setError(true);
                return;
            }

            setChanel(response.data.data.chanel);
            setVideos(videosByChanelId.data.data.videos);
           
            setLoading(false);
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getChanelById();
    }, []);

    const handleChannel = (status) => {
        setIsVideo(status)
    }

    return(
        <div className="wrapper">
            <Sidebar />
            <div className="container">
                <Navbar />
                {error ? (
                    <h1>Server Error</h1>
                ): loading ? (
                    <VideoChanelLoader />
                ):(
                    <>
                        <div className="cover">
                            <img src={JSON.parse(chanel.cover).path} alt="cover" />
                        </div>
                        <div className="channel-wrapper">
                            <ChannelHeader current={(status) => handleChannel(status)} data={chanel}/>
                            {(isVideo)? 
                                (videos.length > 0 ? 
                                    (
                                        <ChannelVideo 
                                            actionDelete={(chanelId => deleteVideo(chanelId))} 
                                            videos={videos}
                                            edit={true} 
                                        />
                                    ): (<EmptyVideo myChannel={true} />)
                                ):
                                (<ChannelDescription data={chanel} />)
                            }
                        </div>
                    </>
                )}
                
            </div>
        </div>
        
    )
}

export default MyChannel;