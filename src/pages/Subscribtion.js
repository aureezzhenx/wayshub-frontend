import { useState, useEffect } from 'react';
// css
import '../App.css';

// component
import Card from '../component/card/Card';
import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component//navbar/Navbar';
import PageLoader from '../component/loader/PageLoader';

// data
import { API } from '../config/api';

import empty from '../icon/empty.png';

const Subscribtion = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);

    const getVideos = async () => {
        try {
            setLoading(true);

            const response = await API.get('/videos-subscribtion');

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            setVideos(response.data.data.videos);
            setLoading(false);

        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getVideos();
    }, []);

    console.log(videos);


    return(
        <div className="wrapper">
            <Sidebar />
            <div className="container">
                <Navbar />
                {error ? (
                    <div className="empty-subscribtion">
                        <img src={empty} alt="empty" />
                        <h3>There is No Video</h3>
                        <p>Subscribe to other channels to display videos from the channels you are subscribed to</p>
                    </div>
                ): loading ? (
                    <PageLoader />
                ):(
                    videos.length > 0 ? (
                        <div className="card-content">
                            {videos.map(video => {                       
                                return <Card 
                                            key={video.id} 
                                            data={video}
                                            edit={false} 
                                        />
                            })}
                        </div>
                    ):(
                        <div>
                            <img src={empty} alt="empty" />
                        </div>
                    )
                )}
            </div>
        </div>
    
    )
}

export default Subscribtion;