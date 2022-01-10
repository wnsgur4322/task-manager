import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import { useEmailFieldOnContext } from "../../../libs/contextLib";
import '../MagicForm.css';


export default function EmailBox() {
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});

        const { emailFieldOn, setEmailFieldOn } = useEmailFieldOnContext();


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
                const { email } = form
                const newErrors = {};         

                if (!email || email === '') newErrors.email = 'This field cannot be blank'

                return newErrors
        }

        return (
                        (emailFieldOn &&
                        <Form.Group
                        key={2}
                        className="formBox-single" 
                        size="md" 
                        controlId="email" 
                        >
                        <Form.Label key={3}>Email</Form.Label>
                        <Form.Control
                        key={4}
                        autoFocus
                        type="email"
                        onChange={(e) => setField("email", e.target.value)}
                        isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type='invalid' key={5}>
                                {errors.email}
                        </Form.Control.Feedback>
                        </Form.Group>)
        );
}