import { FormEventHandler, useState } from 'react';
import Input from '../components/Input';
import { ReactComponent as PersonIcon } from '../assets/person.svg';
import { ReactComponent as LockIcon } from '../assets/lock.svg';
import { ReactComponent as AccountIcon } from '../assets/account.svg';
import Button from '../components/Button';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState({
    error: '',
    value: '',
  });

  const [password, setPassword] = useState({
    error: '',
    value: '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    // TODO: validate and send request
  };

  return (
    <div className="auth login">
      <h1 className="auth__title">My account</h1>
      <AccountIcon className="auth__account" />
      <form className="auth__form">
        <Input
          type="text"
          leftIcon={<PersonIcon />}
          value={username.value}
          error={username.error}
          placeholder="Username"
          onChange={(e) => setUsername({ value: e.target.value, error: '' })}
        />
        <Input
          type="password"
          leftIcon={<LockIcon />}
          value={password.value}
          error={password.error}
          placeholder="Password"
          onChange={(e) => setPassword({ value: e.target.value, error: '' })}
        />
        <Button isLoading={isLoggingIn}>Sign in</Button>
      </form>
    </div>
  );
};

export default Login;
