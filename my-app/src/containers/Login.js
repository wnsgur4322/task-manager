import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import ButtonLoader from "../components/ButtonLoader";
import { useAppContext, useFailedMessageContext, usePermissionLevelContext, useLogoutErrorContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';
import Alert from '@material-ui/lab/Alert';
import AuthService from '../services/auth.services';
import "./Login.css";



export default function Login() {
        const endpoint_url = "/auth/login";
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [isLoading, setIsLoading] = useState(false);
        const [loginFailed, setLoginFailed] = useState(false);
        // context Lib
        const { userHasAuthenticated } = useAppContext();
        const { setPermissionLevel } = usePermissionLevelContext();
        const { failedMessage, setFailedMessage } = useFailedMessageContext();
        const { logoutError } = useLogoutErrorContext();

        const formList =  [
                { label: 'username', error: errors.username },
                { label: 'password', error: errors.password },
        ];

        const setField = (field, value) => {
                setForm({
                  ...form,
                  [field]: value
                })
        // Check and see if errors exist, and remove them from the error object:
                if ( !!errors[field] ) setErrors({
                  ...errors,
                  [field]: null
                })
        }

        const findFormErrors = () => {
                const { username, password } = form
                const newErrors = {};
                
                if (!username || username ==='') newErrors.username = 'This field cannot be blank'

                if (!password || password === '') newErrors.password = 'This field cannot be blank'
                
                return newErrors
        }

        const constructListItem = (label, error, i) => (
                <Form.Group size="lg" controlId={`${label}`} key={i}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                autoFocus
                type={`${label}`}
                onChange={(e) => setField(label, e.target.value)}
                isInvalid={!!error}
                />
                <Form.Control.Feedback type='invalid'>
                        {error}
                </Form.Control.Feedback>
                </Form.Group>
        );



        async function handleLogin(event) {
                event.preventDefault();
                setIsLoading(true);
                const newErrors = findFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setIsLoading(false);
                        setErrors(newErrors)
                } else {
                        await fetch(endpoint_url, {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify({
                                        username: form.username,
                                        password: form.password,      
                                }),
                        })
                        .then(async response => {
                                console.log(response.headers.get('Content-Type'))
                                const data =  await response.json();
                                console.log("-- cookie:", document.cookie.split("=")[1]);
                                console.log("-- data:", data);
                                console.log("-- res.status:", response.status);
                                setFailedMessage(data.message);
                                if(!response.ok || (Cookies.get('client-token') === null)){
                                        console.log("something went wrong", response.status);
                                        setIsLoading(false);
                                        const error = (data && data.message) || response.status;
                                        return Promise.reject(error);
                                } else{
                                        if (response.ok) {
                                                console.log("--res.data:", data);
                                                console.log("--OK cookie:", Cookies.get('client-token'))
                                                setIsLoading(false);
                                                userHasAuthenticated(true);
                                                
                                                localStorage.setItem("client-token", Cookies.get('client-token'));
                                                localStorage.setItem("loggedin-username", form.username);
                                                localStorage.setItem("userId", data.data);
                                                await getPermissionLevel();
                                                history.push("/my-profile");
                                                window.location.reload();
                                        }
                                
                                        return response.data;
                                }
                        })
                        .catch((err) => {
                                setIsLoading(false);
                                setLoginFailed(true);
                                console.error("-- error:", err);
                        })
                        
                        console.log("end fetch call");
                }
        }

        async function getPermissionLevel() {
                console.log("getprofile start")

                fetch("/user-profiles/get-info/" + AuthService.getCurrentUserId(), {
                        method: 'GET',
                        port: 3080,
                        headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${Cookies.get('client-token')}`    
                        }
                })
                .then(async res => {
                        const data = await res.json();
                        console.log("-- data:", data);
                        console.log("-- res.status:", res.status);
                        
                        if(!res.ok || (AuthService.getCurrentUsertoken() === null)){
                                setFailedMessage(data.message);
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                setPermissionLevel(data.data.permissionLevel);
                                console.log(res.status, '[OK]');
                                        
                        }
                })
                .catch((err) => {
                        console.error("-- error:", err);
                        handleLogout();
                })
                console.log("end fetch call");
        }

        function handleLogout() {

                fetch('/auth/logout', {
                        method: 'POST',
                        port: 3080,
                        headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${AuthService.getCurrentUsertoken()}` 
                        }
                })
                .then(async res => {
                        const data = await res.json();
                        console.log("-- data:", data);
                        console.log("-- res.status:", res.status);
                        if(!res.ok){
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                userHasAuthenticated(false);
                                await AuthService.logout();
                                console.log(res.status, '[OK]');
                                history.push("/login");
                                        
                        }
                })
                .catch((err) => {
                        console.error("-- error:", err);
                })
    
                // redirect to login page after logged out
                console.log("end handleLogout fetch call");
        }

        return (
                <div className="Login">
                {logoutError && <Alert severity="error">{failedMessage}</Alert> }
                <h4 className="text-center">Login</h4>
                <Form onSubmit={handleLogin}>
                        {formList.map((item, i) => (
                        constructListItem(item.label, item.error, i)
                        ))}
                        {loginFailed && <Alert severity="error">{failedMessage}</Alert> }
                        <ButtonLoader
                        className="custom-btn"
                        block size="lg"
                        type="submit"
                        isLoading={isLoading}
                        >
                        Login
                        </ButtonLoader>
                </Form>
                </div>
        );
}