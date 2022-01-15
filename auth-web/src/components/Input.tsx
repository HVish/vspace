import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  autoComplete?: 'off' | 'name' | 'email' | 'new-password' | 'current-password';
  className?: string;
  error?: string;
  leftIcon?: ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  rightIcon?: ReactNode;
  type: 'text' | 'password';
  value: string;
}

const Input = ({ autoComplete, className, error, leftIcon, onChange, placeholder, rightIcon, type, value }: Props) => {
  return (
    <div
      className={clsx('input', className, {
        'has-left-icon': Boolean(leftIcon),
        'has-right-icon': Boolean(rightIcon),
        'has-error': Boolean(error),
      })}
    >
      <div className="input__wrapper">
        {leftIcon && <div className="input__left-icon">{leftIcon}</div>}
        <input
          className="input__field"
          autoComplete={autoComplete}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {rightIcon && <div className="input__right-icon">{rightIcon}</div>}
        <div className="input__highlighter" />
      </div>
      {error && <div className="input__error">{error}</div>}
    </div>
  );
};

export default Input;
