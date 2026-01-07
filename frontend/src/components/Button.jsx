import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn-primary ${className}`}
            style={{ opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            {children}
        </motion.button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;
