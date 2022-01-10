import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useHistory, useParams } from "react-router-dom";
import { useAppContext, useFailedMessageContext, usePermissionLevelContext } from "../libs/contextLib";
import Alert from '@material-ui/lab/Alert';
import ButtonLoader from "../components/ButtonLoader";
import AuthService from '../services/auth.services';
import Cookies from 'js-cookie';
import "./Signup.css";

export default function AdminSignup() {
		const endpoint_url = "/auth/create-admin-and-organization-account";
		const [form, setForm] = useState({});
        const history = useHistory();
		const [errors, setErrors] = useState({});
        const [SignupFailed, setSignupFailed] = useState(false);
        const [loginFailed, setLoginFailed] = useState(false);
        const [ isLoading, setIsLoading ] = useState(false);
        const {orgName, signUpemail, orgToken} = useParams();

        const {failedMessage, setFailedMessage} = useFailedMessageContext();
	const { setPermissionLevel } = usePermissionLevelContext();
	const { userHasAuthenticated } = useAppContext();

        const formList_col =  [
            { controlId: 'organizationName', label: 'organizationName', title: 'organization name', type: 'organizationName', val: orgName},
            { controlId: 'organizationToken', label: 'organizationToken', title: 'organization token', type: 'organizationToken', val: orgToken },
        ];
        const formList_col2 =  [
            { controlId: 'firstName', label: 'firstName', title: 'first name', type: 'firstName', error: errors.firstName },
            { controlId: 'lastName', label: 'lastName', title: 'last name', type: 'lastName', error: errors.lastName },
        ];
        const formList_normal =  [
            { controlId: 'username', label: 'username', title: 'username', type: 'username', error: errors.username },
            { controlId: 'password', label: 'password', title: 'password', type: 'password', error: errors.password },
            { controlId: 'passwordConfirm', label: 'passwordConfirm', title: 'confirm password', type: 'password', error: errors.passwordConfirm }
        ];

        const constructListItem_orginfo = (controlId, label, title, type, val, i) => (
            <fieldset disabled>
            <Form.Group as={Col} controlId={`${controlId}`} size="lg" key={i}>
            <Form.Label>{title}</Form.Label>
            <Form.Control
            defaultValue={val}
            type={`${type}`}
            />
            </Form.Group>
            </fieldset>
        );

        const constructListItem_col = (controlId, label, title, type, error, i) => (
            <Form.Group as={Col} controlId={`${controlId}`} size="lg" key={i}>
            <Form.Label>{title}</Form.Label>
            <Form.Control
            type={`${type}`}
            onChange={(e) => setField(label, e.target.value)}
            isInvalid={!!error}
            />
            <Form.Control.Feedback type='invalid'>
            {error}
            </Form.Control.Feedback>
            </Form.Group>
        );

        const constructListItem = (controlId, label, title, type, error, i) => (
                <Form.Group size="lg" controlId={`${controlId}`} key={i}>
                <Form.Label>{title}</Form.Label>
                <Form.Control
                autoFocus
                type={`${type}`}
                onChange={(e) => setField(label, e.target.value)}
                isInvalid={!!error}
                />
                <Form.Control.Feedback type='invalid'>
                        {error}
                </Form.Control.Feedback>
                </Form.Group>
        );

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

		// form validation
        const findFormErrors = () => {
			const {firstName, lastName, username, password, passwordConfirm} = form
			const newErrors = {};

			if (!firstName || firstName === '') newErrors.firstName = 'This field cannot be blank'

			if (!lastName || lastName === '') newErrors.lastName = 'This field cannot be blank'

			if (!username || username === '') newErrors.username = 'This field cannot be blank'

			if (!password || password === '') newErrors.password = 'This field cannot be blank'

			if (! password ||  password === '' ||  password !==  passwordConfirm ) newErrors.passwordConfirm = 'password and confirm password fields should be matched'
			
			return newErrors
	        }

        async function handleLogin() {

            await fetch("/auth/login", {
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
                                    const error = (data && data.message) || response.status;
                                    return Promise.reject(error);
                            } else{
                                    if (response.ok) {
                                            console.log("--res.data:", data);
                                            console.log("--OK cookie:", Cookies.get('client-token'))
                                            userHasAuthenticated(true);
                                            
                                            localStorage.setItem("client-token", Cookies.get('client-token'));
                                            localStorage.setItem("loggedin-username", form.username);
                                            localStorage.setItem("userId", data.data);
                                            await getPermissionLevel();

                                            history.push("/my-profile");
                                    }
                            
                                    return response.data;
                            }
                    })
                    .catch((err) => {
                            console.error("-- error:", err);
                            setLoginFailed(true);
                    })
                    console.log("end fetch call 2");
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
                    setLoginFailed(true);
            })
            console.log("end fetch call");
        }


        async function handleSubmit(event) {
                event.preventDefault();

                const newErrors = findFormErrors();
                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors)
                } else {
                  		setIsLoading(true);
                        fetch(endpoint_url, {
                                method: 'POST',
                                port: 3080,
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
									organizationToken: orgToken,
									organizationName: orgName,
									firstName: form.firstName,
									lastName: form.lastName,
									email: signUpemail,
									username: form.username,
									password: form.password,
									passwordConfirm: form.passwordConfirm    
                                })
                        })
                        .then(async res => {
                            const data = await res.json();
                            console.log("-- data:", data);
                            console.log("-- res.status:", res.status);
                            setFailedMessage(data.message);
                            if(!res.ok){
                                    console.log("something went wrong", res.status);
                                    setIsLoading(false);
                                    const error = (data && data.message) || res.status;
                                    return Promise.reject(error);
                            } else{
                                    await handleLogin();
                                    setIsLoading(false);
                                    console.log(res.status, ":OK");
                            }
                        })
                        .catch((err) => {
                            setSignupFailed(true);
                            console.error("-- error:", err);
                        })
                        console.log("end fetch call");
						setIsLoading(false);
                }
        }

        function renderForm() {
                return (
                        <Form onSubmit={handleSubmit}>
                        <h4 className="text-center">Admin Sign Up</h4>
                        <Row className="mb-3">
                            {formList_col.map((item , i) => (
                                constructListItem_orginfo(item.controlId, item.label, item.title, item.type, item.val, i)
                            ))}
                        </Row>
                        <Row className="mb-3">
                            {formList_col2.map((item, i) => (
                                constructListItem_col(item.controlId, item.label, item.title, item.type, item.error, i)
                            ))}
                        </Row>
							<fieldset disabled>
								<Form.Group size="lg" controlId="email">
								<Form.Label>email</Form.Label>
								<Form.Control
								autoFocus
								defaultValue={signUpemail}
								type="email"
								/>
								</Form.Group>
							</fieldset>
                            {formList_normal.map((item, i) => (
                                constructListItem(item.controlId, item.label, item.title, item.type, item.error, i)
                            ))}
                            {SignupFailed && <Alert severity="error">{failedMessage}</Alert> }
                            {loginFailed && <Alert severity="warning">{failedMessage}</Alert> }
                          	<ButtonLoader
                            block
                            className="custom-btn"
                            size="lg"
                            type="submit"
                            isLoading={isLoading}
                          	>
                            Sign up
                          	</ButtonLoader>
                        </Form>
                      );
        }
                  
        return (
                <div className="Signup">
                        {renderForm()}
                </div>
        );
}

