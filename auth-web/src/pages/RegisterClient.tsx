import { FormEventHandler, useState } from 'react';
import Input from '../components/Input';
import { ReactComponent as AccountIcon } from '../assets/account.svg';
import { ReactComponent as LinkIcon } from '../assets/link.svg';
import { ReactComponent as PersonIcon } from '../assets/person.svg';
import { ReactComponent as VerifiedIcon } from '../assets/verified.svg';
import Button from '../components/Button';
import Password from '../components/Password';
import { registerClient } from '../shared/api';

const RegisterClient = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const [name, setName] = useState({
    value: '',
    error: '',
  });

  const [secret, setSecret] = useState({
    value: '',
    error: '',
  });

  const [redirect, setRedirect] = useState({
    value: '',
    error: '',
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!name.value) {
      setName((state) => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (!secret.value) {
      setSecret((state) => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (!redirect.value) {
      setRedirect((state) => ({ ...state, error: 'This field is required' }));
      hasError = true;
    }

    if (hasError) return;

    setIsRegistering(true);

    try {
      await registerClient({
        name: name.value,
        secret: secret.value,
        logo: 'https://s3.ap-south-1.amazonaws.com/missioneasyclasses.com/public/images/thumbnail.png',
        redirectURIs: [redirect.value],
      });
      setIsRegistering(false);
      setIsCreated(true);
    } catch (error) {
      console.error(error);
      setIsRegistering(false);
      if ((error as any).response?.data.message) {
        setSecret((state) => ({ ...state, error: (error as any).response.data.message }));
      }
    }
  };

  return (
    <div className="auth register-client">
      <h1 className="auth__title">Register Client</h1>
      <AccountIcon className="auth__account" />
      {isCreated ? (
        <div className="auth__created">
          <VerifiedIcon width={48} height={48} color="#43a047" />
          <p>
            An account for <strong>{name.value}</strong> has been created.
          </p>
        </div>
      ) : (
        <form className="auth__form" onSubmit={handleSubmit}>
          <Input
            type="text"
            autoComplete="name"
            leftIcon={<PersonIcon />}
            value={name.value}
            error={name.error}
            placeholder="Client name"
            onChange={(e) => setName({ value: e.target.value, error: '' })}
          />
          <Password
            autoComplete="new-password"
            value={secret.value}
            error={secret.error}
            placeholder="Password"
            onChange={(e) => setSecret({ value: e.target.value, error: '' })}
          />
          <Input
            type="text"
            leftIcon={<LinkIcon />}
            value={redirect.value}
            error={redirect.error}
            placeholder="Redirect URL"
            onChange={(e) => setRedirect({ value: e.target.value, error: '' })}
          />
          <Button type="submit" isLoading={isRegistering}>
            Register
          </Button>
        </form>
      )}
    </div>
  );
};

export default RegisterClient;
