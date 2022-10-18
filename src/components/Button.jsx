import React from "react";

const Button = ({onClickFunction, button}) => {
    return (
        <button
            className={button.style}
            disabled={button.disabled}
            onClick={onClickFunction}
        >
            {button.label}
        </button>
    )
}

export default Button;