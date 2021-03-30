import './video.css';
import { Link } from 'react-router-dom';
import {useState, useEffect} from 'react';
import VideoChanelLoader from '../loader/VideoChanelLoader';

const EmptyVideo = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    },[]);

    return (
        loading ? (
            <VideoChanelLoader />
        ): (
           props.myChannel ? (
            <>
                <p className="empty-video">You don't have a video, create it now</p>
                <Link to="add" className="link">
                    <p className="create-now">Create Now</p>
                </Link>
                
            </>
           ) : (
            <>
                <p className="empty-video">This channel has no videos</p>
            </>
           )
        )
    )
};

export default EmptyVideo;