import React from 'react';

const Input = ({ type = 'text', name, value, onChange, placeholder, required = false, className = '', ...props }) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`input-field ${className}`}
            {...props}
        />
    );
};

export default Input;
