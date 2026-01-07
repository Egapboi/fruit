import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type = 'text', placeholder, value, onChange, name, required = false, className = '' }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            className={`input-field ${className}`}
        />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    required: PropTypes.bool,
    className: PropTypes.string,
};

export default Input;
