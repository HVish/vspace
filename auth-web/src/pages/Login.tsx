import { FormEventHandler, useState } from 'react';
import Input from '../components/Input';
import { ReactComponent as AccountIcon } from '../assets/account.svg';
import { ReactComponent as EmailIcon } from '../assets/email.svg';
import Button from '../components/Button';
import Password from '../components/Password';
import { login } from '../shared/api';
import { setAccessToken } from '../shared/session';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [email, setEmail] = useState({
    value: '',
    error: '',
  });

  const [password, setPassword] = useState({
    value: '',
    error: '',
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!email.value) {
      setEmail((state) => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (!password.value) {
      setPassword((state) => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoggingIn(true);

    try {
      const response = await login({ username: email.value, password: password.value });
      setAccessToken(response.accessToken.value);
      setIsLoggingIn(false);
      // TODO: proceed furthure based on url query params
    } catch (error) {
      console.error(error);
      setIsLoggingIn(false);
      if ((error as any).response?.data.message) {
        setPassword((state) => ({ ...state, error: (error as any).response.data.message }));
      }
    }
  };

  return (
    <div className="auth login">
      <h1 className="auth__title">My account</h1>
      <AccountIcon className="auth__account" />
      <form className="auth__form" onSubmit={handleSubmit}>
        <Input
          type="text"
          autoComplete="email"
          leftIcon={<EmailIcon />}
          value={email.value}
          error={email.error}
          placeholder="Email"
          onChange={(e) => setEmail({ value: e.target.value, error: '' })}
        />
        <Password
          autoComplete="current-password"
          value={password.value}
          error={password.error}
          placeholder="Password"
          onChange={(e) => setPassword({ value: e.target.value, error: '' })}
        />
        <Button type="submit" isLoading={isLoggingIn}>
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default Login;
