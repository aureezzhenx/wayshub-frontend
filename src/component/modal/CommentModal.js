import { useEffect, useState } from 'react';
import './modal.css';

const CommentModal = (props) => {

    const [show, setShow] = useState();

    const closeModal = () => {
        setShow("close");
        setTimeout(() => {
            props.closeModal();
        }, 300)
        
    }

    const deleteComment = () => {
        props.actionDelete();
    }

    useEffect(() => {
        setTimeout(() => {
            setShow("show");
        }, 10)
    },[]);

    return  (
        <div className={`modal-container ${show}`}>
            <div className="modal-box">
                <div className="modal-body">
                    <p>Are u sure to delete this comment ?</p>
                </div>
                <div className="modal-footer">
                    <button onClick={closeModal}>Cancel</button>
                    <button className="btn-del" onClick={deleteComment}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default CommentModal;