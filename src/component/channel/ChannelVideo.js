import {useState, useEffect} from 'react';
import './channel.css';
import Card from '../card/Card';
import VideoChanelLoader from '../loader/VideoChanelLoader';

const ChannelVideo = (props) => {
    const [loading, setLoading] = useState(true);
    const deleteVideo = (chanelId) => {
        props.actionDelete(chanelId);
    }

    useEffect(() => {
       setLoading(false);
    },[]);

    return(
        loading ? (
            <VideoChanelLoader />
        ):(
            <div className="channel-card">
                {props.videos.map(video => {                       
                    return <Card 
                                key={video.id} 
                                data={video} 
                                actionDelete={(chanelId)=>deleteVideo(chanelId)}
                                edit={props.edit}
                            />
                })}
            </div>
        )
    )
}

export default ChannelVideo;