import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import { useCommentsOnContext } from "../../../libs/contextLib";
import '../MagicForm.css';

export default function CommentsBox() {

        const { commentsOn, setCommentsOn } = useCommentsOnContext();

        return (
                        (commentsOn &&
                        <Form.Group className="formBox-single" size="md" controlId="role" key={9}>
                                <Form.Label>Additional comments</Form.Label>
                                <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Leave a comment here"
                                />
                        </Form.Group>)
        );
}