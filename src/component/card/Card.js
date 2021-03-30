import './card.css';
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import number_views from '../../icon/number_views.svg';
import refresh_icon from '../../icon/refresh_icon.svg';
import DropdownVideo from '../dropdown/DropdownVideo';
import menudots from '../../icon/menudots.png';
import CardLoader from '../loader/CardLoader';

import Modal from '../modal/Modal';

const Card = (props) => {
    const [modal, setModal] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState();


    const getThumbnail = () => {
        setLoading(true);
        setThumbnail(JSON.parse(props.data.thumbnail).path)
        setLoading(false);
    }

    const showDropdown = () => {
        if(showMenu){
            setShowMenu(false);
        } else {
            setShowMenu(true);
        }
    }

    const showModal = () => {
        setVideoId(props.data.id);
        setModal(true);
    }
    
    const closeModal = () => {
        setVideoId(null);
        setModal(false);
    }

    const deleteVideo = () => {
        props.actionDelete(videoId);
        setModal(false);
    }

    useEffect(() => {
        getThumbnail();
    },[])

    return(
        <div className="card">
            {modal && (<Modal closemodal={() => { closeModal() }} actionDelete={() => deleteVideo()}/>)}
            <div className="card-thumbnail-container">
                <Link to={`/detail/${props.data.id}`} className="link">
                    {loading ? (
                        <CardLoader />
                    ):(
                        <img src={thumbnail} alt="card_thumbnail" className="card-thumbnail" />
                    )}
                </Link>
                {props.edit && (
                    <button className="btn-delete" onClick={showDropdown}>
                        <img src={menudots} alt="remove" />
                    </button>
                )}
                {showMenu && (
                    <DropdownVideo 
                        showModalDelete={() => {showModal()}} 
                        show={showMenu} 
                        />
                    )
                }
            </div>
            <Link to={`/detail/${props.data.id}`} className="link">
                <h1 className="card-title">{props.data.title}</h1>
            </Link>
            <Link to={`/content-creator/${props.data.chanel.id}`} className="link">
                <p className="card-username">{props.data.chanel.chanelName}</p>
            </Link>
            <span>
                <img src={number_views} alt="number_views" /> {props.data.viewCount}
            </span>
            <span>
                <img src={refresh_icon} alt="refresh_icon" /> {new Date(props.data.createdAt).toLocaleDateString()}
            </span>
        </div>
    )
}

export default Card;