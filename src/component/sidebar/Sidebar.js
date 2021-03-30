import './sidebar.css';
import {Link} from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Icon from '../../icon/icon.svg';
import home_icon from '../../icon/home_icon.svg';
import home_icon_active from '../../icon/home_icon_active.svg';
import subscription_icon from '../../icon/subscription_icon.svg';
import subscription_icon_active from '../../icon/subscription_icon_active.svg';

import { API } from '../../config/api';
import {AppContext} from '../../context/AppContext';


const Sidebar = () => {
    const pathName = window.location.pathname;
    const [state, dispatch] = useContext(AppContext);

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


    useEffect(() => {
        getSubscribtion();
    },[])

    return(
        <div className="sidebar">
            <img src={Icon} alt="icon" className="sidebar-logo"/>
            <ul className="sidebar-list">
                <li className="sidebar-list-item">
                    <Link to="/" className="sidebar-link">
                        <img src={pathName === '/'? home_icon_active:home_icon} alt="home_icon" />
                        <span className={pathName==='/'? "active":""}>Home</span>
                    </Link>
                </li>
                <li className="sidebar-list-item">
                    <Link to="/subscribtion" className="sidebar-link">
                        <img src={pathName === '/subscribtion'? subscription_icon_active:subscription_icon} alt="subscription_icon" />
                        <span className={pathName === '/subscribtion'? "active":""}>Subscribtion</span>
                    </Link>
                </li>
            </ul>

            {state.subscribtion.length > 0 && (
                <h1 className="sidebar-list-title">Channel</h1>
            )}

            <ul className="sidebar-list">
                {state.subscribtion.map(subscribtion => {
                    return (
                        <li className="sidebar-list-item" key={subscribtion.id}>
                            <Link to={`/content-creator/${subscribtion.id}`} className="sidebar-link">
                                <img src={JSON.parse(subscribtion.photo).path} alt="user_channel_icon" className="sidebar-photo-profile" />
                                <span className="sidebar-username">{subscribtion.chanelName}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            {state.subscribtion.length > 5 && (
                <button className="show-more">Show More</button>
            )}
        </div>
    )
}

export default Sidebar;