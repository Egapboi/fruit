import React from 'react';

const Button = ({ children, onClick, type = 'button', disabled = false, variant = 'primary', className = '', ...props }) => {
    const baseClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
