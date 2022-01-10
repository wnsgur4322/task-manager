import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Button, ButtonGroup, Form, Dropdown, Card } from "react-bootstrap";
import Alert from '@material-ui/lab/Alert';
import ButtonLoader from "../components/ButtonLoader";
import { useFailedMessageContext } from "../libs/contextLib";
import "./Token.css";

export default function TokenUpdate() {
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [newUser, setNewUser] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [UpdateFailed, setUpdateFailed] = useState(false);
        const {failedMessage, setFailedMessage} = useFailedMessageContext();


        const formList =  [
                { controlId: 'organization', label: 'org', title: 'organization', type: 'text', error: errors.org },
                { controlId: 'email', label: 'email', title: 'email', type: 'email', error: errors.email },
                { controlId: 'email', label: 'confirmEmail', title: 'confirm email', type: 'email', error: errors.confirmEmail }
        ];

        const constructListItem = (controlId, label, title, type, error, i) => (
                <Form.Group size="lg" controlId={`${controlId}`} key={i} style={{width: "70%", margin: "0 auto"}}>
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

        const findFormErrors = () => {
                const { org, email, confirmEmail } = form
                const newErrors = {};
                
                if (!org || org ==='') newErrors.org = 'This field cannot be blank'

                if (!email || email === '') newErrors.email = 'This field cannot be blank'

                if (!confirmEmail || confirmEmail === '' || email !== confirmEmail) newErrors.confirmEmail = 'email and confirm email fields should be matched'
                
                return newErrors
        }

        function handleUpdateToken(event) {
                event.preventDefault();

                const newErrors = findFormErrors();
                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors)
                } else {
                        fetch("/owner/update-organization-token", {
                                method: 'PUT',
                                port: 3080,
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                        organizationName: form.org,
                                        adminEmail: form.email,
                                        adminEmailConfirm: form.confirmEmail      
                                })
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
                                        setIsLoading(false);
                                        console.log("200 OK");
                                        setNewUser("Newuser");
                                }
                        })
                        .catch((err) => {
                                setUpdateFailed(true);
                                setIsLoading(false);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }
        
        function renderForm() {
        return (
                <Form>
                <h4 className="text-center">Update Token</h4>
                        {formList.map((item, i) => (
                        constructListItem(item.controlId, item.label, item.title, item.type, item.error, i)
                        ))}
                        {UpdateFailed && <Alert severity="error">{failedMessage}</Alert> }
                        <Form.Group className="two-button" size="lg" controlId="buttons" key={3} style={{width: "100%", margin: "0 auto", marginTop: "10px"}}>
                        <Row className="row-profile" >
                                <ButtonLoader
                                style={{width: "90%"}}
                                className="custom-btn" 
                                block size="md" 
                                type="submit"
                                isLoading={isLoading}
                                onClick={handleUpdateToken}
                                >
                                Update
                                </ButtonLoader>
                        </Row>
                        <Row className="row-profile">
                                <ButtonLoader
                                style={{width: "90%"}}
                                onClick={() => history.push("/owner/org-tokens")}
                                className="custom-btn" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </ButtonLoader>
                        </Row>
                        </Form.Group>
                </Form>
                )
        };

        function renderConfirmationForm() {
                return (
                        <Card style={{ margin: '0 auto', width: '30rem', textAlign: 'center'}}>
                                <Card.Body>
                                <Card.Title>Welcome to Task Manager Again!</Card.Title>
                                <Card.Text className="mb-5 text-muted">
                                Please check your email for further instructions on how to complete your account setup.
                                </Card.Text>
                                <Card.Footer>
                                        <p className="text-center">Having trouble?</p>
                                        <Card.Link  onClick={()=> window.open("https://www.gmail.com")}>Contact us</Card.Link>
                                </Card.Footer>
                                </Card.Body>
                        </Card>
                );
        }
                  
        return (
                <div className="Token">
                        {newUser === null ? renderForm() : renderConfirmationForm()}
                </div>
        );
}