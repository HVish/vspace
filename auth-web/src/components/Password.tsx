import React, { useState } from 'react';

import { ReactComponent as EyeIcon } from '../assets/eye.svg';
import { ReactComponent as EyeCloseIcon } from '../assets/eye-close.svg';
import { ReactComponent as LockIcon } from '../assets/lock.svg';
import Input from './Input';

interface Props {
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  value: string;
}

const Password = ({ error, onChange, placeholder, value }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      error={error}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      leftIcon={<LockIcon />}
      rightIcon={
        <button
          type="button"
          className="input__toggle-password"
          onClick={(e) => {
            e.stopPropagation();
            setShowPassword((show) => !show);
          }}
        >
          {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
};

export default Password;
