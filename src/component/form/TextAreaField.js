import './form.css';

import ErrorInfo from './ErrorInfo';
import {Fragment, useState, forwardRef, useImperativeHandle, useEffect} from 'react';

const TextAreaField = forwardRef((props,ref) => {
    const [isFocus, setFocus] = useState(false);
    const [submit, setSubmit] = useState(false);

    const [error, setError] = useState({
        status:false,
        messages: ""
    });
    const [value, setValue] = useState(props.value);

    
    const handleInputChange = (event) => {
        setValue(event.target.value);
        setError({
            messages:""
        });
        props.onChange(event.target.name, event.target.value);
        setFocus(true);
    }

    const doSubmit = () => {
        setSubmit(true);
    }
    
    const validate = () =>{
        for(let i = 0; i < props.validation.length; i++){
            if(props.validation[i] === "required"){
                if(!value || value === ""){
                    setError({
                        ...error,
                        status:true,
                        messages: `The ${props.placeholder} field must be filled !`
                    });
        
                    return false;
                } 
            }

            if(props.validation[i] === "email"){
                const mailformat = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
                if(!value.match(mailformat)){
                    setError({
                        ...error,
                        status:true,
                        messages: `Not valid email !`
                    });
        
                    return false;
                }
            }
        }

        setError({
            status: false
        });
        return true;
        
    }


    useEffect(() => {
        if(submit){
            setSubmit(false);
            setFocus(false);
            setValue('');
        }

        if(isFocus){
            validate();
        }
    }, [value, submit]);

    useImperativeHandle(ref, () => {
        return {
            validate: () => validate(),
            doSubmit: () => doSubmit()
        }
    })


    return(
        <Fragment>
            <textarea
                placeholder={props.placeholder} 
                name={props.name} 
                onChange={(event) => {handleInputChange(event)}}
                autoComplete={props.autoComplete}
                value={value}
            ></textarea>
            {error.status && (<ErrorInfo messages={error.messages}/>)}
        </Fragment>
    )
})

export default TextAreaField;