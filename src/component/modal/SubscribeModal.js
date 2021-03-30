import { useEffect, useState } from 'react';
import './modal.css';

const SubscribeModal = (props) => {

    const [show, setShow] = useState('close');


    useEffect(() => {
        setShow("show");
        setTimeout(() => {
            setShow('close');
            props.closeModal();
        }, 2000);

        return () => {
            setShow('close');
        }
    },[]);


    return  (
        <div className={`modal-container-subscribe ${show}`}>
            <div className="modal-box-subscribe">
                <div className="modal-header-subscribe">
                    <h1>{props.message}</h1>
                </div>
            </div>
        </div>
    )
}

export default SubscribeModal;