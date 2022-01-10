import React, { useState, useEffect } from "react";
import { Col, Row, Spinner, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useHistory, useParams } from "react-router-dom";
import {
        List, ListItemAvatar, ListItem, 
        ListItemText, ListItemSecondaryAction, ListItemIcon,
        Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography
        } from '@material-ui/core';
import { useAppContext, useFailedMessageContext, usePermissionLevelContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import Alert from '@material-ui/lab/Alert';
import ButtonLoader from "../components/ButtonLoader";
import AuthService from '../services/auth.services';
import Cookies from 'js-cookie';
import "./magicformSubmit.css";

export default function SubmitMagicform() {
	const endpoint_url = "/auth/create-member-account";
	const [form, setForm] = useState({});
        const history = useHistory();
	const [errors, setErrors] = useState({});
        const [ isLoading, setIsLoading ] = useState(false);
        const [renderOrder, setRenderOrder] = useState(new Array);
        const [datePick, setDatePick] = useState(new Date());
        const {email, formId} = useParams();
        const [retrieveFailed, setRetrieveFailed] = useState();
        const [selectedForm, setSelectedForm] = useState();
        const [magicFormName, setMagicFormName] = useState("");
        const [isBusy, setBusy] = useState(true);

        const { failedMessage, setFailedMessage } = useFailedMessageContext();

        async function retrieveForms() {
                fetch("/magic-form-templates/get-form-template/" + formId, {
                        method: 'GET',
                        port: 3080,
                        headers: { 
                                'Content-Type': 'application/json' 
                        }
                })
                .then(async res => {
                        const data = await res.json();
                        console.log("-- data:", data);
                        console.log("-- res.status:", res.status);
                        setRetrieveFailed(false);
                        if(!res.ok){
                                setFailedMessage(data.message);
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                setSelectedForm(data.data);
                                setMagicFormName(data.data.magicFormName);
                                handleRetrieveForm(data.data);
                                setBusy(false);
                                console.log(renderOrder);
                                console.log(res.status, '[OK]');
                                        
                        }
                })
                .catch((err) => {
                        setRetrieveFailed(true);
                        console.error("-- error:", err);
                })
                console.log("end fetch call");
        }

        useEffect(() => {
                const fetchData = async () => {
                        await retrieveForms();
                     }
                   
                fetchData();

        }, []);


        const constructRoleOptions = (role, i) => (
                <option key={i} value={role} >{role}</option>
        );

        const handleRetrieveForm = (data) => {
                Object.entries(data.fields).map((field) => {
                        switch(field[1].inputFieldType) {
                                case 'inputText':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field[1].order}>
                                                        <Form.Group as={Col}
                                                        className="formBox-multi" 
                                                        controlId="inputText" 
                                                        size="md" 
                                                        >
                                                        <Form.Label>{field[0]}</Form.Label>
                                                        <Form.Control
                                                        autoFocus
                                                        type="text"
                                                        onChange={(e) => setField(field[0], e.target.value)}
                                                        />
                                                        <Form.Control.Feedback type='invalid'>
                                                                {errors[field[0]]}
                                                        </Form.Control.Feedback>
                                                        </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'textArea':
                                        renderOrder.push(
                                                <Grid item xs={12} key={field[1].order}>                               
                                                <Form.Group 
                                                        className="formBox-single" 
                                                        size="md" 
                                                        controlId="role" 
                                                        >
                                                        <Form.Label>{field[0]}</Form.Label>
                                                        <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        onChange={(e) => setField(field[0], e.target.value)}
                                                        />
                                                        <Form.Control.Feedback type='invalid'>
                                                                {errors[field[0]]}
                                                        </Form.Control.Feedback>
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputEmail':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field[1].order}>                      
                                                <Form.Group
                                                className="formBox-single" 
                                                size="md" 
                                                controlId="inputEmail" 
                                                >
                                                <Form.Label>{field[0]}</Form.Label>
                                                <Form.Control
                                                autoFocus
                                                type="email"
                                                onChange={(e) => setField(field[0], e.target.value)}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                        {errors[field[0]]}
                                                </Form.Control.Feedback>
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputDate':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field[1].order}>                               
                                                <Form.Group 
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>{field[0]}</Form.Label>
                                                <DatePicker
                                                className="form-control"
                                                selected={datePick}
                                                onSelect={(date) => setDatePick(date)} //when day is clicked
                                                onChange={(date) => setDatePick(date)} //only when value has changed
                                                />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputTime':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field[1].order}>                              
                                                <Form.Group 
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>{field[0]}</Form.Label>
                                                <DatePicker
                                                className="form-control"
                                                selected={datePick}
                                                onChange={(time) => setDatePick(time)}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                                />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputCheckbox':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field[1].order}>                              
                                                <Form.Group 
                                                        className="formBox-single" 
                                                        size="md" 
                                                        controlId="inputCheckbox" 
                                                        >
                                                        <Form.Check
                                                        className="text-center"
                                                        style={{margin: "0 auto", marginTop: "10px"}} 
                                                        type="checkbox"
                                                        id="default-checkbox"
                                                        label={field[0]}
                                                        />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'selectWithOptions':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field[1].order}>                     
                                                <Form.Group 
                                                className="formBox-single" 
                                                size="md" 
                                                controlId="selectWithOptions" 
                                                >
                                                <Form.Label>{field[0]}</Form.Label>
                                                <Form.Control
                                                                as="select"
                                                                >
                                                                <option value={null} >Choose one ...</option>
                                                                {field[1].dropdownOptions.map((item, i) => (
                                                                        constructRoleOptions(item, i)
                                                                ))}
                                                </Form.Control>
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                        }
                });
                console.log("renderOrder:", renderOrder);
        };

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
			const { firstName, lastName, username, password, passwordConfirm} = form
			const newErrors = {};

			if (!firstName || firstName === '') newErrors.firstName = 'This field cannot be blank'

			if (!lastName || lastName === '') newErrors.lastName = 'This field cannot be blank'

			if (!username || username === '') newErrors.username = 'This field cannot be blank'

			if (!password || password === '') newErrors.password = 'This field cannot be blank'

			if (! password ||  password === '' ||  password !==  passwordConfirm ) newErrors.passwordConfirm = 'password and confirm password fields should be matched'
			
			return newErrors
	    }

        function renderForm() {
                return (
                        <Form style={{minWidth: "100%", backgroundColor: "#f9a825", margin: "0 auto", borderRadius: ".5rem", paddingBottom: "10px"}}>
                        <h4 className="text-center">{magicFormName}</h4>
                        <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                wrap="wrap"
                                >
                                {renderOrder.map((component) => (component))}
                        </Grid>
                        <Form.Group className="two-button" size="lg" controlId="buttons" key={11} style={{width: "30%", margin: "0 auto", marginTop: "10px"}}>
                        <ButtonLoader
                        block
                        className="custom-btn"
                        size="md"
                        type="submit"
                        isLoading={isLoading}
                        onClick={() => console.log(form["first name"])}
                        >
                        Submit
                        </ButtonLoader>
                        </Form.Group>
                        </Form>
                );
        }
   
        return (       
                <div className="magicForm">
                {retrieveFailed && <Alert severity="error">{failedMessage}</Alert> }
                {isBusy ? (
                                <Row style={{textAlign: "center", margin: "0 auto"}}>
                                <Spinner animation="border" role="status" style={{textAlign: "center", margin: "0 auto"}}>
                                </Spinner>
                                </Row>
                      ) : renderForm() 
                }
                </div>
        );
}

