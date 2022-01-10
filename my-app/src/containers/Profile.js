import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthService from "../services/auth.services";
import { useAppContext, useFailedMessageContext, usePermissionLevelContext, useLogoutErrorContext } from "../libs/contextLib";
import Card from "react-bootstrap/Card";
import "./Profile.css";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Alert from '@material-ui/lab/Alert';
import Nav from "react-bootstrap/Nav";

export default function Profile() {
        const endpoint_url = "/user-profiles/get-info/" + AuthService.getCurrentUserId();
        const patch_url = "/user-profiles/update-my-info";
        const JWTtoken = AuthService.getCurrentUsertoken();
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [editProfile, setEditProfile] = useState(false);
        const [EditFailed, setEditFailed] = useState(false);
        const [isUserProfile, setIsUserProfile] = useState(false);
        const [roles, setRoles] = useState([]);

        const { failedMessage, setFailedMessage } = useFailedMessageContext();
        const { setPermissionLevel } = usePermissionLevelContext();
        const { userHasAuthenticated } = useAppContext();
        const { setLogoutError } = useLogoutErrorContext();

        useEffect(() => {
                async function getProfile() {
                        console.log("getprofile start")

                        fetch(endpoint_url, {
                                method: 'GET',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`    
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
                                        setProfileList([
                                                {label: 'organization', value: data.data.organizationName },
                                                {label: 'username', value: data.data.username },
                                                {label: 'first name', value: data.data.firstName },
                                                {label: 'last name', value: data.data.lastName },
                                                {label: 'email', value: data.data.email },
                                        
                                        ]);
                                        setIsUserProfile(data.data.isTheUserOfTheProfile);
                                        setPermissionLevel(data.data.permissionLevel);
                                        setRoles(data.data.roles);
                                        localStorage.setItem("orgName", data.data.organizationName);
                                        console.log(res.status, '[OK]');
                                                
                                }
                        })
                        .catch((err) => {
                                console.error("-- error:", err);
                                setLogoutError(true);
                                handleLogout();
                        })
                        console.log("end fetch call");
                }
                const fetchData = async () => {
                        await getProfile();
                     }
                   
                fetchData();
        }, []);

        const formList =  [
                { controlId: 'username', label: 'username', title: 'username', type: 'text', error: errors.username },
                { controlId: 'firstName', label: 'firstName', title: 'first name', type: 'text', error: errors.firstName },
                { controlId: 'lastName', label: 'lastName', title: 'last name', type: 'text', error: errors.lastName },
                { controlId: 'email', label: 'email', title: 'email', type: 'email', error: errors.email }
        ];
        
        const initialProfile = [
                {label: 'organization', value: "" },
                {label: 'username', value: "" },
                {label: 'first name', value: "" },
                {label: 'last name', value: "" },
                {label: 'email', value: "" },

        ]
        const [profilelist, setProfileList] = useState(initialProfile);
        

        const constructListItem = (controlId, label, title, type, error, i) => (
                <Form.Group className="formBox" size="md" controlId={`${controlId}`} key={i}>
                <Form.Label>{title}</Form.Label>
                <Form.Control
                defaultValue={profilelist[i+1].value}
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

        const constructProfileItem = (label, value, i) => (
                <div className="row" key={i}>
                        <div className="col-sm-3">
                        <h6 className="mb-0">{label}</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                        {value}
                        </div>
                </div>
        );
        
        const setField = (field, value) => {
                setForm({
                        ...form,
                        [field]: value
                });
        // Check and see if errors exist, and remove them from the error object:
                if ( !!errors[field] ) setErrors({
                  ...errors,
                  [field]: null
                })
        }
		// form validation
        const findFormErrors = () => {
		const { firstName, lastName, email, username } = form
		const newErrors = {};
                var pattern = new RegExp(/^[0-9\b]+$/);

		if (firstName === '') newErrors.firstName = 'This field cannot be blank'

		if (lastName === '') newErrors.lastName = 'This field cannot be blank'

		if (email === '') newErrors.email = 'This field cannot be blank'

                if (username === '') newErrors.username = 'This field cannot be blank'

		return newErrors
	}

        function isEditProfile() {
                setEditProfile(true);
        }
        function renderProfile() {
                return (
                        <div className="col-md-8">
                        <div className="card mb-4">
                                <div className="card-body">
                                {profilelist.map((item, i) => (
                                        constructProfileItem(item.label, item.value, i)
                                ))}
                                <div className="row">
                                        <div className="col-sm-3">
                                        <h6 className="mb-0">roles</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                        {roles.map((role) => {
                                                if (role === roles[roles.length-1]) {
                                                        return role
                                                } else {
                                                        return role +", "
                                                }
                                        })}
                                        </div>
                                </div>
                                {isUserProfile &&
                                <Row>
                                        <div className="button-box">
                                        <Button
                                        onClick={isEditProfile}
                                        className="custom-btn-profile-edit" 
                                        block size="md" 
                                        type="submit"
                                        >Edit</Button>
                                        </div>
                                </Row>
                                }
                                </div>
                                
                        </div>
                                </div>

                );
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

        function handleEdit(event) {
                event.preventDefault();
                console.log("editprofile start")
                const newErrors = findFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch(patch_url, {
                                method: 'PATCH',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`    
                                },
                                body: JSON.stringify({
                                        firstName: form.firstName,
                                        lastName: form.lastName,
                                        email: form.email,
                                        username: form.username   
                                }),
                        })
                        .then(async res => {
                                const data = await res.json();
                                console.log("-- data:", data);
                                console.log("-- res.status:", res.status);
                                setFailedMessage(data.message);
                                if(!res.ok){
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        return Promise.reject(error);
                                } else{
                                        window.location.reload();
                                        setEditProfile(false);
                                        console.log(res.status, '[OK]');
                                                
                                }
                        })
                        .catch((err) => {
                                setEditFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }

        function cancelBtn(event) {
                event.preventDefault();
                setErrors({
                        ...errors,
                        firstName: null,
                        lastName: null,
                        email: null,
                        username: null

                })
                console.log("cancel!");
                setEditProfile(false);
        }

        function renderEditProfile() {
                return (
                        <div className="col-md-8">
                        <div className="card">
                        <Form>
                                {formList.map((item, i) => (
                                        constructListItem(item.controlId, item.label, item.title, item.type, item.error, i)
                                ))}
                                {EditFailed && <Alert severity="error">{failedMessage}</Alert> }
                                <Form.Group className="two-button" style={{marginTop: "10px"}}>
                                <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleEdit}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="submit"
                                >
                                Save changes
                                </Button>
                                </Row>
                                <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={cancelBtn}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                                </Row>
                                </Form.Group>
                        </Form>
                        </div>
                        </div>   
         

                );

        }

        return (
                <div className="Profile">
                        <div className="row gutters-sm">
                                <div className="col-md-4 mb-3">
                                <div className="card">
                                <div className="d-flex flex-column align-items-center text-center">
                                        <img src="https://img.icons8.com/ios-glyphs/240/000000/user-male-circle.png"  alt="profile picture" className="rounded-circle" width="150" />
                                        <div className="mt-3">
                                        <h4>{profilelist[2].value} {profilelist[3].value}</h4>
                                        {/* <p className="text-secondary mb-1">{roles.map((role) => <Row >{role}</Row>)}</p> */}
                                </div>
                                </div>
                                </div>
                                </div>
                                {editProfile === false ? renderProfile() : renderEditProfile()}
                        </div>
                </div>
        );
}