import React from "react";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./ButtonLoader.css";

export default function ButtonLoader({
        isLoading,
        className = "",
        disabled = false,
        ...props
}) {
        return (
                <Button
                        disabled={disabled || isLoading}
                        className={`LoaderButton ${className}`}
                        {...props}
                >
                        {isLoading && <BsArrowRepeat className="spinning" />}
                        {props.children}
                </Button>
        );
}
