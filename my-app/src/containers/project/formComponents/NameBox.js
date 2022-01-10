import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import { useNameFieldOnContext } from "../../../libs/contextLib";
import '../MagicForm.css';


export default function NameBox() {
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});

        const { nameFieldOn, setNameFieldOn } = useNameFieldOnContext();


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
                const { firstName, lastName } = form
                const newErrors = {};         

                if (!firstName || firstName === '') newErrors.firstName = 'This field cannot be blank'

                if (!lastName || lastName === '') newErrors.lastName = 'This field cannot be blank'

                return newErrors
        }

        return (
                        (nameFieldOn &&
                        <Row className="mb-3">
                                <Form.Group as={Col} className="formBox-multi" controlId="firstName" size="md" key={0}>
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                type="text"
                                onChange={(e) => setField("firstName", e.target.value)}
                                isInvalid={!!errors.firstName}
                                />
                                <Form.Control.Feedback type='invalid'>
                                {errors.firstName}
                                </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} className="formBox-multi" controlId="lastName" size="md" key={1}>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                type="text"
                                onChange={(e) => setField("lastName", e.target.value)}
                                isInvalid={!!errors.lastName}
                                />
                                <Form.Control.Feedback type='invalid'>
                                {errors.lastName}
                                </Form.Control.Feedback>
                                </Form.Group>
                        </Row>)
        );
} 