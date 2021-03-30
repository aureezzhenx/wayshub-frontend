import './video.css';
import {Link} from 'react-router-dom';
import ReactPlayer from 'react-player';

import Comment from '../comment/Comment';

import number_views from '../../icon/number_views.svg';
import refresh_icon from '../../icon/refresh_icon.svg';
import like from '../../icon/like.png';
import liked from '../../icon/liked.png';
import SubscribeModal from '../modal/SubscribeModal';
import { useEffect, useState } from 'react';

const Video = (props) => {
    const [isSubscribe, setIsSubscribe] = useState(false);
    const [isSameChanel, setIsSameChanel] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [toast, setToast] = useState({
        status: false,
        message: ""
    });

    const closeModal = () => {
        setToast({
            status: false,
            message: ""
        });
    }

    
    const doSubscribe = () => {
        props.subscribe();
        setIsSubscribe(true);
        setToast({
            status: true,
            message: "Subscribe to this channel"
        });
    }

    const doUnSubscribe = () => {
        props.unSubscribe();
        setIsSubscribe(false);
        setToast({
            status: true,
            message: "Unsubscribe to this channel"
        });
    }

    const checkSubscribe = async () => {
        const subscribe = await props.checkSubscribe();

        setIsSubscribe(subscribe);
    }

    const doLike = () => {
        props.doLike();
        setToast({
            status: true,
            message: "Like this video"
        })
    }

    const unLike = () => {
        props.unLike();
        setToast({
            status: true,
            message: "Unlike this video"
        })
    }


    useEffect(() => {
        if(currentUser.id === props.data.chanel.id){
            setIsSameChanel(true);
        }
       checkSubscribe();
       return () => {
           setToast({
               status: false,
               message: ""
           });
       }
    },[]);



    return(
        <div>
            {toast.status && (<SubscribeModal message={toast.message} closeModal={() => closeModal()} />)}
            <div className="video-wrapper">
                <ReactPlayer
                    width="100%"
                    height="100%"
                    className="video-player"
                    playing
                    url={JSON.parse(props.data.video).path}
                    controls={true}
                />
                <h1 className="video-title">{props.data.title}</h1>
                <div className="video-info">
                    <div className="info-item">
                        {
                            props.isLiked ? (
                                <button onClick={unLike}>
                            <img src={liked} alt="like-views" />
                        </button>
                            ): (
                                <button onClick={doLike}>
                            <img src={like} alt="like-views" />
                        </button>
                            )
                        }
                        <span>{props.countLikes}</span>
                    </div>
                    <div className="info-item">
                        <img src={number_views} alt="number_views" /> 
                        <span>{props.data.viewCount}</span>
                    </div>

                    <div className="info-item">
                        <img src={refresh_icon} alt="refresh_icon" />
                        <span>{new Date(props.data.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div className="video-description-wrapper">
                <div className="video-description-header">
                    <img src={JSON.parse(props.data.chanel.photo).path} alt="foto profil"/>
                    <div className="video-username">
                        <Link to={`/content-creator/${props.data.chanel.id}`} className="link">
                            <span className="content-creator-username">{props.data.chanel.chanelName}</span>
                        </Link>
                        <span className="count-subscriber">{props.subscribers} Subscriber</span>
                    </div>
                    {!isSameChanel && (
                        <div className="button-wrapper">
                            {!isSubscribe ? (
                                <button className="btn-subscribe" onClick={doSubscribe}>Subscribe</button>
                            ):(
                                <button className="btn-unsubscribe" onClick={doUnSubscribe}>Unsubscribe</button>
                            )}
                        </div>
                    )}
                </div>
                <div className="video-description-body">
                    <p>{props.data.description}</p>
                    <button className="show-more">Show More</button>
                </div>
                <Comment
                    currentUser={props.currentUser} 
                    comments={props.comments}
                    addComment={async (formData) => {
                        await props.addComment(formData);
                    }}
                    deleteComment={async (commentId) => {
                        await props.deleteComment(commentId);
                    }}
                />
            </div>
        </div>
    )
}

export default Video;