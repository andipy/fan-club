import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { auth } from "../services/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// import components
import Input from '../components/Input';
import Button from "../components/Button";


const Login = () => {

    let navigate = useNavigate();

    const [currentUser, setCurrentUser] = useContext(AuthContext);

    // state to store information about the validity of the inputs
    const [valuesValidity, setValuesValidity] = useState({
        email: false,
        password: false,
    });

    // state to store the data input by the user in the registration inputs
    const [values, setValues] = useState({
        email: '',
        password: '',
    })

    // function that grabs the data input by the user in the inputs and stores it into the related state; and updates the information about the validity of the data input by the user in the inputs based on the patterrn required by each input
    const handleInput = (e) => {
        setValues({...values, [e.target.name]: e.target.value});

        if (e.target.name == 'email') {
            var re = new RegExp(inputs[0].pattern);
            if ( re.test(e.target.value) ) {
                setValuesValidity({...valuesValidity, [e.target.name]: true});
            } else {
                setValuesValidity({...valuesValidity, [e.target.name]: false});
            };
        }

        if (e.target.name == 'password') {
            var re = new RegExp(inputs[1].pattern);
            if ( re.test(e.target.value) ) {
                setValuesValidity({...valuesValidity, [e.target.name]: true});
            } else {
                setValuesValidity({...valuesValidity, [e.target.name]: false});
            };
        }
    }

    // state and useEffect to handle button status (style, and "enabled vs diasabled"), based on the validity of the inputs and checkbox
    const [button, setButton] = useState({});    
    useEffect(() => {
        if ( valuesValidity.email == true && valuesValidity.password == true ) {
            setButton({
                label: 'Login',
                style: 'w-full bg-violet-600 text-white mt-3 py-3 rounded-lg font-regular',
                disabled: false                
            });
        } else {
            setButton({
                label: 'Login',
                style: 'w-full bg-zinc-800 text-zinc-600 mt-3 py-3 rounded-lg font-regular',
                disabled: true                
            });
        }
    },[valuesValidity])

    // function to prevent the page to refresh when the registration for button is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
            // Signed in            
            const user = userCredential.user;
            navigate('/artists');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    // array with the data about the inputs needed in the registration form
    const inputs = [
        {
            id: 1,
            label: 'Your email',
            type: 'email',
            name: 'email',
            placeholder: 'Type your email',
            required: true,
            pattern: '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\.([a-zA-Z]{2,5})$'
        },{
            id: 2,
            label: 'Your password',
            type: 'password',
            name: 'password',
            placeholder: 'Type your password',
            required: true,
            pattern:'^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'
        }
    ]

    const buttonGoToSignup = {
        label: 'Go to signup',
        style: 'w-full border-solid border-2 border-violet-600 text-violet-400 mt-3 py-3 rounded-lg font-semibold',
        disabled: false
    }

    useEffect(()=>{
        if ( currentUser ) {
            navigate('/artists');
        }
    },[currentUser]);

    return (
        <div className="px-6 mx-0 pt-20 pb-10">
            <h1 className="text-zinc-200 text-xl font-semibold mb-2">Welcome back 🙂</h1>
            <p className="text-zinc-200 text-2xl font-bold mb-8">Login with email and password!</p>
            <form className="mb-8" action="" onSubmit={handleSubmit}>
                {inputs.map((input) => {
                    return (                    
                        <Input
                            key={input.id}
                            placeholder={input.placeholder}
                            type={input.type}
                            label={input.label}
                            name={input.name}
                            value={values[input.name]}
                            onChange={handleInput}
                        />
                    )
                })}                
                <Button button={button} />                
            </form>
            <h4 className="text-zinc-200 text-xl font-semibold">Don't have an account yet?</h4>
            <Button
                button={buttonGoToSignup}
                onClickFunction={()=>{navigate("/signup")}}            
            />
        </div>
    )
}

export default Login;