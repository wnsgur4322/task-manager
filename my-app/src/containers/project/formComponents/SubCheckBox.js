import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import { useSubCheckOnContext } from "../../../libs/contextLib";
import '../MagicForm.css';

export default function SubCheckBox() {

        const { subCheckOn, setSubCheckOn } = useSubCheckOnContext();

        return (
                        (subCheckOn &&
                        <Form.Group className="formBox-single" size="md" controlId="subCheck" key={10}>
                                <Form.Check
                                className="text-center"
                                style={{margin: "0 auto", marginTop: "10px"}} 
                                type="checkbox"
                                id="default-checkbox"
                                label="Subscribe to newsletter"
                                />
                        </Form.Group>)
        );
}