import { useEffect, useState } from 'react';
import './modal.css';

const Modal = (props) => {

    const [show, setShow] = useState();

    const closeModal = () => {
        setShow("close");
        setTimeout(() => {
            props.closemodal();
        }, 300)
        
    }

    const deleteVideo = () => {
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
                    <p>Are u sure to delete this video ?</p>
                </div>
                <div className="modal-footer">
                    <button onClick={closeModal}>Cancel</button>
                    <button className="btn-del" onClick={deleteVideo}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;