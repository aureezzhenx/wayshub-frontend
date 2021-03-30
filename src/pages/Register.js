import {Link} from 'react-router-dom';
import {useState, useRef, createRef} from 'react';

import '../App.css';
import title from '../title.svg';

import InputField from '../component/form/InputField';
import TextAreaField from '../component/form/TextAreaField';
import SuccessInfo from '../component/form/SuccessInfo';
import Alert from '../component/form/Alert';
import ButtonLoader from '../component/loader/ButtonLoader';


import { API } from '../config/api';

const Register = () => {
    const inputRef = useRef([createRef(), createRef(), createRef(), createRef()]);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        status: false,
        message: ""
    });

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        chanelName: "",
        description: ""
    });

    
    const validate = () => {
        const error = [];
        for(let i = 0; i < inputRef.current.length; i++){
            const valid = inputRef.current[i].current.validate();

            if(!valid){
                error.push("error");
            }
        }

        if(error.length > 0){
            return false;
        }

        for(let i = 0; i < inputRef.current.length; i++){
            inputRef.current[i].current.doSubmit();

        }
        
        return true;
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError({
                ...error,
                status: false
            });

            setSuccess(false);

            if(!validate()){
                setLoading(false);
                return false;
            }

            const body = JSON.stringify(formData);
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const response = await API.post('/register', body, config);

            if(response.data.status === "success"){
                setSuccess(true);
                setError({
                    ...error,
                    status: false
                });
                setLoading(false);
            } else {
                setError({
                    status: true,
                    message: response.data.error.message
                });
                setSuccess(false);
                setLoading(false);
            }
           
        } catch(err){
            console.log(err);
        }
    }


    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name] : value
        });

        setSuccess(false);
        setError({
            ...error,
            status: false
        })
    }

    return(
        <div className="landing-container">
              <div className="landing-welcome">
                  <img src={title} alt ="title" />
                  <Link to="/login" className="link">
                    <button className="button">Sign In</button>
                  </Link>
              </div>

            <div className="landing-form">
                <h1>Sign Up</h1>
                {success && (<SuccessInfo message="Registration was successful" />)}
                {error.status && (<Alert status="error-info" message={error.message} />)}
                <form onSubmit={handleSubmit}>
                    <InputField 
                        type="text" 
                        placeholder="Email" 
                        name="email" 
                        onChange={handleInputChange}
                        autoComplete="off"
                        value={formData.email}
                        ref={inputRef.current[0]}
                        validation={["required", "email"]}
            
                    />
                    <InputField 
                        type="password" 
                        placeholder="Password"
                        name="password"
                        onChange={handleInputChange}
                        autoComplete="off"
                        value={formData.password}
                        ref={inputRef.current[1]}
                        validation={["required"]}
                        
                    />
                    <InputField 
                        type="text" 
                        placeholder="Name Channel"
                        name="chanelName"
                        onChange={handleInputChange}
                        autoComplete="off"
                        value={formData.chanelName}
                        ref={inputRef.current[2]}
                        validation={["required"]}

                    />
        
                    <TextAreaField
                        placeholder="Description Channel"
                        name="description"
                        onChange={handleInputChange}
                        value={formData.description}
                        ref={inputRef.current[3]}
                        validation={["required"]}
                    />
    
                    <button className="button">
                        {loading ? 
                            (
                                <ButtonLoader />
                            ): 
                            ("Sign Up")
                        }
                    </button>
                </form>
            </div>
        </div>  
    )
}

export default Register;