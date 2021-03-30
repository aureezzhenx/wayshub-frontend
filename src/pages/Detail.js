import { useState, useEffect, useContext } from 'react';
import {useParams} from 'react-router-dom';

// css
import '../App.css';

// component
import Video from '../component/video/Video';
import Card from '../component/card/Card';
import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component//navbar/Navbar';
import PageLoader from '../component/loader/PageLoader';
import ButtonLoader from '../component/loader/ButtonLoader';

import { AppContext } from '../context/AppContext';

import { API } from '../config/api';

const Detail = () => {
    const [state, dispatch] = useContext(AppContext);
    const { id } = useParams();

    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(5);
    const [isFinish, setIsFinish] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadShowMore, setLoadShowMore] = useState(false);
    const [video, setVideo] = useState();
    const [recomendationVideos, setRecomendationVideos] = useState([]);
    const [channel, setChanel] = useState();
    const [comments, setComments] = useState([]);
    const [subscribers, setSubscribers] = useState();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [isLiked, setIsLiked] = useState(false);
    const [countLikes, setCountLikes] = useState(0);


    const getVideos = async () => {
        try {
            const response = await API.get(`/videos/${0}/${limit}`);

            if(response.data.status !== "success"){
                setError(true);
                return;
            }
            setRecomendationVideos(response.data.data.videos);

        } catch(err){
            console.log(err);
        }
    }

    const showMore = async () => {
        
       try {
            setLoadShowMore(true);
            const tmpData = [...recomendationVideos];
            const lastIndex = tmpData.length;
    
            const response = await API.get(`/videos/${lastIndex}/${limit}`);
    
            if(response.data.data.videos.length === 0){
                setIsFinish(true);
            }
    
            for(let i = 0; i < response.data.data.videos.length; i++){
                tmpData[lastIndex + i] = response.data.data.videos[i]
            }
    
            setRecomendationVideos(tmpData);
            setLoadShowMore(false);

       } catch(err){
           console.log(err);
           setLoadShowMore(false);
       }

    }
    

    const getSubscribtion = async () => {
        try {
            const subscribtions = await API.get('/subscribe');

            if(subscribtions.data.status === "success"){
                dispatch({
                    type: "LOAD_SUBSCRIBTION",
                    payload: subscribtions.data.data
                });
                return;
            }

        } catch(err){
            console.log(err)
        }
    }


    const getVideoById = async () => {
        try {
            setLoading(true);

            const response = await API.get(`/video/${id}`);

            const chanelId = response.data.data.video.chanel.id;

            const chanelById = await API.get(`/chanel/${chanelId}`);

            if(response.data.status !== "success"){
                setError(true);
                setLoading(false);
                return;
            }

            if(chanelById.data.status !== "success"){
                setError(true);
                setLoading(false);
                return;
            }

            setChanel(chanelById.data.data.chanel);
            setSubscribers(chanelById.data.data.chanel.subscribers.length);
            setVideo(response.data.data.video);
            setComments(response.data.data.video.comments.reverse());
            setLoading(false);

        } catch(err){
            console.log(err);
        }
    }

    const checkSubscribe = async () => {
        try {
            const body = {
                chanelId: video.chanel.id
            }


            const response = await API.post('/check-subscribe', body);

            if(response.data.status === "success"){
                return true;
                
            }

            return false;
            
        } catch(err){
            console.log(err);
        }
    }

    const doSubscribe = async () => {
        try {

            const body = {
                chanelId: video.chanel.id
            }

            const response = await API.post('/subscribe', body);

            if(response.data.status === "success"){
                setSubscribers(subscribers + 1);
                const subscribe = [...state.subscribtion];
                subscribe.push(response.data.data.subscribe.chanel);
                const subsbribtionAfterSubscribe = {
                    subscribtion: subscribe
                }

                dispatch({
                    type: "SUBSCRIBE",
                    payload: subsbribtionAfterSubscribe
                });

                
                return;
            }

            return;
            
        } catch(err){
            console.log(err);
        }
    }

    const doUnSubscribe = async () => {
        try {

            const chanelId = video.chanel.id;

            const response = await API.delete(`/subscribe/${chanelId}`);

            if(response.data.status === "success"){
                const indexUnsubsribe = state.subscribtion.findIndex(subscribtion => subscribtion.id === parseInt(response.data.data.id));
                
                const subscribe = [...state.subscribtion];
                subscribe.splice(indexUnsubsribe, 1);
                const subsbribtionAfterUnSubscribe = {
                    subscribtion: subscribe
                }

                dispatch({
                    type: "UNSUBSCRIBE",
                    payload: subsbribtionAfterUnSubscribe
                });

                setSubscribers(subscribers- 1);
                return;
            }

            return;
            
        } catch(err){
            console.log(err);
        }
    }

    const addComment = async (formData) => {
        try {  
            const videoId = video.id 
            const response = await API.post(`/video/${videoId}/comment`, formData);

            if(response.data.status === "success"){
                setComments([
                    response.data.data.comment,
                    ...comments
                    
                ]);
            }

        } catch(err){
            console.log(err);
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const videoId = video.id;

            const response = await API.delete(`/video/${videoId}/comment/${commentId}`);

            if(response.data.status === "success"){
                const indexDeletedComment = comments.findIndex(comment => comment.id === commentId);
                const commentsAfterDelete = [...comments];
                commentsAfterDelete.splice(indexDeletedComment, 1);
                setComments(commentsAfterDelete);
                return;
            }
            

        } catch(err){
            console.log(err);
        }
    }    

    const checkLike = async () => {
        try {
            const response = await API.get(`/check-like/${id}`);

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            setIsLiked(response.data.data.isLiked);
            setCountLikes(response.data.data.countLikes);
        } catch(err){
            console.log(err);
        }
    }

    const doLike = async () => {
        try{
            const body = {
                videoId: id
            }

            const response = await API.post('/add-like', body);

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            setIsLiked(true);
            setCountLikes(countLikes + 1);

        } catch(err){
            console.log(err)
        }
    }

    const unLike = async () => {
        try {

            const response = await API.delete(`/unlike/${id}`);

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            setIsLiked(false);
            setCountLikes(countLikes - 1);

        } catch(err){
            console.log(err);
        }
    }

    

    useEffect(() => {
        getSubscribtion();
        getVideoById();
        getVideos();
        checkLike();
    },[id]);

    
    return(
        <div className="wrapper">
            <Sidebar />
            <div className="container">
                <Navbar />
                    {error ? (
                        <h1>Server Error</h1>
                    ): loading ? (
                        <PageLoader />
                    ):(
                        
                        <div className="video-container">
                            <Video 
                                currentUser={currentUser}
                                subscribers={subscribers}
                                subscribe={() => doSubscribe()}
                                unSubscribe = {() => doUnSubscribe()} 
                                data={video}
                                chanel={channel}
                                checkSubscribe={() => checkSubscribe()}
                                comments={comments}
                                addComment={async (formData) => await addComment(formData)}
                                deleteComment={async (commentId) => await deleteComment(commentId)}
                                isLiked={isLiked}
                                countLikes={countLikes}
                                doLike={() => doLike()}
                                unLike={() => unLike()}
                        
                                
                               
                            />
                            <div className="recomendation-video">
                                {recomendationVideos.map(recomendVideo => {
                                    
                                    return (recomendVideo.id === video.id)? (null): (
                                    <Card 
                                            key={recomendVideo.id} 
                                            data={recomendVideo}
                                            edit={false} 
                                        />
                                    )
                                    
                                })}
                            
                                {isFinish ? 
                                        null
                                    :
                                        <button onClick={showMore} className="show-more-videos">
                                            {loadShowMore ? (
                                                <ButtonLoader />
                                            ): (
                                                "Show More"
                                            )}    
                                        </button>}
                            </div>
                           
                        </div>
                    )}           
            </div>
        </div>
        
   )
}

export default Detail;