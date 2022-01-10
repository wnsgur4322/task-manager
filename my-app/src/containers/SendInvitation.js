import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthService from "../services/auth.services";
import "./Profile.css";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Alert from '@material-ui/lab/Alert';
import Nav from "react-bootstrap/Nav";

export default function SendInvitation() {
        const endpoint_url = "/admin/send-member-invite";
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [InvitedFailed, setInvitedFailed] = useState(false);

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
		const { email, confirmEmail } = form
		const newErrors = {};


		if (!email || email === '') newErrors.email = 'This field cannot be blank'
                
                if ((!confirmEmail) || (email !== confirmEmail)) newErrors.confirmEmail = 'This should be matched with email'
	
                
		return newErrors
	}

        function handleSubmit(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = findFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch(endpoint_url, {
                                method: 'POST',
                                port: 3080,
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                        inviteEmail: form.email,
                                        inviteEmailConfirm: form.confirmEmail      
                                }),
                                signal: signal
                        })
                        .then(async res => {
                                const data = await res.json();
                                console.log("-- data:", data);
                                console.log("-- res.status:", res.status);
                                if(!res.ok){
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        setTimeout(controller.abort(), 3000);
                                        return Promise.reject(error);
                                } else{
                                        console.log("201 OK");
                                        alert("the member has invited successfully!");
                                        history.push("/profile");
                                }
                        })
                        .catch((err) => {
                                setInvitedFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }

        function cancelBtn(event) {
                event.preventDefault();
                console.log("cancel!");
                history.push("/profile");
        }

        function Invitation() {
                return (
                        <div className="col-md-8">
                        <div className="card">
                        <Form>      
                                <Form.Group className="formBox" size="md" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                autoFocus
                                type="email"
                                onChange={(e) => setField('email', e.target.value)}
                                isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type='invalid'>
                                        {errors.email}
                                </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="formBox" size="md" controlId="email">
                                <Form.Label>Confirm Email</Form.Label>
                                <Form.Control
                                autoFocus
                                type="email"
                                onChange={(e) => setField('confirmEmail', e.target.value)}
                                isInvalid={!!errors.confirmEmail}
                                />
                                <Form.Control.Feedback type='invalid'>
                                        {errors.confirmEmail}
                                </Form.Control.Feedback>
                                </Form.Group>
                                {InvitedFailed && <Alert severity="error">Failed to invite the member!</Alert> }
                                <Form.Group className="two-button">
                                <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleSubmit}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="submit"
                                >
                                Submit
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
                                <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin" className="rounded-circle" width="150" />
                                        <div className="mt-3">
                                        <h4>John Doe</h4>
                                        <p className="text-secondary mb-1">Full Stack Developer</p>
                                        <p className="text-muted font-size-sm"> Sacramento, CA</p>
                                </div>
                                </div>
                                </div>
                                <div className="profile-usermenu">
                                        <ul className="nav">
                                        <li>
                                                <LinkContainer className="usermenu" to="/invite-member">
                                                <Nav.Link className="usermenu.nav-link.active">Send Invitation</Nav.Link>
                                                </LinkContainer>
                                        </li>
                                        <li>
                                                <LinkContainer className="usermenu" to="/something1">
                                                <Nav.Link className="usermenu.nav-link">Somthing user menu 1</Nav.Link>
                                                </LinkContainer>
                                        </li>
                                        <li>
                                                <LinkContainer className="usermenu" to="/something2">
                                                <Nav.Link className="usermenu.nav-link">Somthing user menu 2</Nav.Link>
                                                </LinkContainer>
                                        </li>
                                        </ul>
                                </div>
                                </div>
                                </div>
                                {Invitation()}
                        </div>
                </div>
        );
}