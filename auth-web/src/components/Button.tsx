import { FC, MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import clsx from 'clsx';
import Loader from './Loader';

interface Props {
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?(e: MouseEvent): Promise<any>;
  /**
   * @default 'button'
   */
  type?: 'button' | 'submit';
}

const Button: FC<Props> = ({ className, children, disabled, isLoading: _isLoading, onClick, type = 'button' }) => {
  const [isLoading, setIsLoading] = useState(_isLoading);

  useEffect(() => setIsLoading(_isLoading), [_isLoading]);

  const handleClick: MouseEventHandler = async (e) => {
    if (!onClick) return;
    setIsLoading(true);
    await onClick(e);
    setIsLoading(false);
  };

  return (
    <button className={clsx('button', className)} disabled={disabled || isLoading} type={type} onClick={handleClick}>
      {isLoading ? <Loader className="button__loader" /> : children}
    </button>
  );
};

export default Button;
