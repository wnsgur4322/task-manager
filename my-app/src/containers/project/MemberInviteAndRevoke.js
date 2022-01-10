import React, { useState } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import { useFailedMessageContext, useSetInviteOpenContext, useSetRevokeOpenContext } from "../../libs/contextLib";
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import AuthService from "../../services/auth.services";
import './MyOrganization.css';


export default function MemberInviteAndRevoke() {
        const JWTtoken = AuthService.getCurrentUsertoken();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});

        const [InvitedFailed, setInvitedFailed] = useState(false);
        const [RevokeFailed, setRevokeFailed] = useState(false);
        
        const { failedMessage, setFailedMessage } = useFailedMessageContext();
        const { inviteOpen, setInviteOpen } = useSetInviteOpenContext();
        const { revokeOpen, setRevokeOpen } = useSetRevokeOpenContext();

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

        const inviteFormErrors = () => {
		const { email, confirmEmail } = form
		const newErrors = {};

		if (!email || email === '') newErrors.email = 'This field cannot be blank'
                
                if ((!confirmEmail) || (email !== confirmEmail)) newErrors.confirmEmail = 'This should be matched with email'
	
		return newErrors

        }

        const handleInviteClose = () => {
                setErrors({
                        ...errors,
                        email: null,
                        confirmEmail: null
                })
                setInvitedFailed(false);
                setInviteOpen(false);
        };
        
        const handleRevokeClose = () => {
                setErrors({
                        ...errors,
                        email: null,
                        confirmEmail: null
                })
                setRevokeFailed(false);
                setRevokeOpen(false);
        };

        function handleInvite(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = inviteFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/admin/send-member-invite", {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
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
                                setFailedMessage(data.message);
                                if(!res.ok){
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        setTimeout(controller.abort(), 3000);
                                        return Promise.reject(error);
                                } else{
                                        console.log("201 OK");
                                        handleInviteClose();
                                }
                        })
                        .catch((err) => {
                                setInvitedFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }

        function handleRevoke(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = inviteFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/admin/revoke-member-invite", {
                                method: 'DELETE',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        inviteEmail: form.email,
                                        inviteEmailConfirm: form.confirmEmail      
                                }),
                                signal: signal
                        })
                        .then(async res => {
                                console.log("-- data:", res);
                                console.log("-- res.status:", res.status);
                                if(!res.ok){
                                        const data = await res.json();
                                        console.log(data);
                                        setFailedMessage(data.message);
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        setTimeout(controller.abort(), 3000);
                                        return Promise.reject(error);
                                } else{
                                        console.log("201 OK");
                                        handleRevokeClose();
                                }
                        })
                        .catch((err) => {
                                setRevokeFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }
        

        return (
                <div>
                                {/* invite member modal */}
                                <Modal
                                key={0}
                                size="md"
                                aria-labelledby="contained-modal-title-vcenter"
                                aria-describedby="contained-modal-description"
                                centered
                                show={inviteOpen}
                                onHide={handleInviteClose}
                                >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Send Member Invitation
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
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
                                                <Form.Group className="formBox" size="md" controlId="confirmEmail">
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
                                                {InvitedFailed && <Alert severity="error">{failedMessage}</Alert> }
                                </Form>
                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleInvite}
                                                className="custom-btn-profile" 
                                                block size="md" 
                                                type="submit"
                                                >
                                                Invite
                                                </Button>
                                                </Row>
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleInviteClose}
                                                className="custom-btn-profile" 
                                                block size="md" 
                                                type="button"
                                                >
                                                Cancel
                                                </Button>
                                        </Row>
                                </Modal.Footer>
                                </Modal>
                                {/* revoke invitation modal */}
                                <Modal
                                key={1}
                                size="md"
                                aria-labelledby="contained-modal-title-vcenter"
                                aria-describedby="contained-modal-description"
                                centered
                                show={revokeOpen}
                                onHide={handleRevokeClose}
                                >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Revoke Member Invitation
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
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
                                                <Form.Group className="formBox" size="md" controlId="confirmEmail">
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
                                                {RevokeFailed && <Alert severity="error">{failedMessage}</Alert> }
                                </Form>
                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleRevoke}
                                                className="custom-btn-profile" 
                                                block size="md" 
                                                type="submit"
                                                >
                                                Revoke
                                                </Button>
                                                </Row>
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleRevokeClose}
                                                className="custom-btn-profile" 
                                                block size="md" 
                                                type="button"
                                                >
                                                Cancel
                                                </Button>
                                        </Row>
                                </Modal.Footer>
                                </Modal>
        </div>
        );
}