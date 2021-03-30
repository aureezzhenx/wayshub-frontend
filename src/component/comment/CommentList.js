import './comment.css';
import menudots from '../../icon/menudots.png';
import DropdownComment from '../dropdown/DropdownComment';
import { useState, useEffect } from 'react';
import CommentModal from '../modal/CommentModal';
import CommentLoader from '../loader/CommentLoader';

const CommentList = (props) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sameUser, setSameUser] = useState(false);

    const checkUser = () => {
        setLoading(true);
        const chanelId = props.data.chanel.id;
        const currentUserId = props.currentUser.id;
        
        if(chanelId === currentUserId){
            setSameUser(true)
        } else {
            setSameUser(false);
        }
        setLoading(false);
    }
    
    const showDropdown = () => {
        if(showMenu){
            setShowMenu(false);
        } else {
            setShowMenu(true);
        }
    }

    const showModalDelete = () => {
        setShowMenu(false);
        setShowModal(true);
    }

    const closeModalDelete = () => {
        setShowModal(false);
    }

    const deleteComment = async () => {
        setLoading(true);
        await props.deleteComment(props.data.id);
        setShowModal(false);
        setLoading(false);
        
    }

    useEffect(() => {
        checkUser();
    }, []);

    return(
        <div className="comment-list">
            {showModal && 
                (
                    <CommentModal 
                        closeModal={()=> {closeModalDelete()}}
                        actionDelete={() => {deleteComment()}} 
                    />
                )}
            <div className="triangle-comment"></div>
            <img className="comment-thumbnail" src={JSON.parse(props.data.chanel.photo).path} alt="proifl"/>
            <div className="comment-body">
                {loading ? (
                    <CommentLoader />
                ):(
                    <>
                        <div className="comment">
                            <h2>{props.data.chanel.chanelName}</h2>
                            <p>{props.data.comment}</p>
                        </div>
                        {sameUser && (
                            <div className="comment-menu">
                                <button onClick={showDropdown}>
                                    <img src={menudots} alt="menudots" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            {showMenu && (
                <DropdownComment 
                    showModalDelete={() => {showModalDelete()}} 
                    show={showMenu} 
                />
            )}
        </div>
    )
}

export default CommentList;