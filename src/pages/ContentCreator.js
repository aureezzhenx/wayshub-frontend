import { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import '../App.css';

import ChannelVideo from '../component/channel/ChannelVideo';

import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component//navbar/Navbar';
import VideoChanelLoader from '../component/loader/VideoChanelLoader';
import SubscribeModal from '../component/modal/SubscribeModal';
import EmptyVideo from '../component/video/EmptyVideo';

import { AppContext } from '../context/AppContext';
import { API } from '../config/api';


const ContentCreator = () => {
    const [state, dispatch] = useContext(AppContext);
    const [isSubscribe, setIsSubscribe] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chanel, setChanel] = useState([]);
    const [videos, setVideos] = useState([]);
    const [subscribers, setSubscribers] = useState();
    const { id } = useParams();
    const router = useHistory();

    const [modal, setModal] = useState({
        status: false,
        message: ""
    });

    const closeModal = () => {
        setModal({
            status: false,
            message: ""
        });
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

    const getChanelById = async () => {
        try {
            setLoading(true);
            const currentUser = await JSON.parse(localStorage.getItem('user'));
            const response = await API.get(`/chanel/${id}`);

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            if(currentUser.id === response.data.data.chanel.id){
                router.push('/my-channel');
            }

            const videosByChanelId = await API.get(`/chanel/${id}/videos`);
            
            if(videosByChanelId.data.status !== "success"){
                setError(true);
                return;
            } 

            setChanel(response.data.data.chanel);
            setVideos(videosByChanelId.data.data.videos);
            setSubscribers(response.data.data.chanel.subscribers.length);
           
            setLoading(false);
        } catch(err){
            console.log(err);
        }
    }

    const doSubscribe = async () => {
        try {

            const body = {
                chanelId: chanel.id
            }

            
            const response = await API.post('/subscribe', body);

            if(response.data.status === "success"){
                setIsSubscribe(true);
                setModal({
                    status: true,
                    message: "Subscribe to this channel"
                });
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
            
        } catch(err){
            console.log(err);
        }
    }

    const doUnSubscribe = async () => {
        try {

            const chanelId = chanel.id;

            const response = await API.delete(`/subscribe/${chanelId}`);

            if(response.data.status === "success"){
                setIsSubscribe(false);
                setModal({
                    status: true,
                    message: "Unsubscribe to this channel"
                });
                setSubscribers(subscribers - 1);
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
                return;
            }
            
        } catch(err){
            console.log(err);
        }
    }

    const checkSubscribe = async () => {
        try {
            const body = {
                chanelId: chanel.id
            }

            const response = await API.post('/check-subscribe', body);

            if(response.data.status === "success"){
                setIsSubscribe(true);
                return
                
            }

            setIsSubscribe(false);
            return;
            
        } catch(err){
            console.log(err);
        }
    }   

    useEffect(() => {
        getChanelById();
        getSubscribtion();
        return () => {
            setModal({
                status: false,
                message: ""
            })
        }
    }, [id]);

    
    useEffect(() => {
        checkSubscribe();
    }, [chanel.id]);

    console.log(chanel)
     
    return(
        <div className="wrapper">
            <Sidebar />
            <div className="container">
                <Navbar />
                {modal.status && (<SubscribeModal message={modal.message} closeModal={() => closeModal()} />)}
                

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
                            <div className="channel-header border-bottom">
                                <img src={JSON.parse(chanel.photo).path} alt="foto profil"/>
                                <div className="channel-username">
                                    <span>{chanel.chanelName}</span>
                                    <span>{subscribers} Subscribers</span>
                                </div>
                                <div className="button-wrapper">
                                {!isSubscribe ? (
                                    <button className="btn-subscribe" onClick={doSubscribe}>Subscribe</button>
                                ):(
                                    <button className="btn-unsubscribe" onClick={doUnSubscribe}>Unsubscribe</button>
                                )}
                                </div>
                            </div>
                            {videos.length > 0? (
                                 <ChannelVideo videos={videos} edit={false} />
                            ): <EmptyVideo myChannel={false} />}
                        </div>
                    </>
                )}
                
            </div>
        </div>
        
    )
}

export default ContentCreator;