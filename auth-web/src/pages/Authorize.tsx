import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as ErrorIcon } from '../assets/error.svg';
import Loader from '../components/Loader';
import { getAuthCode, verifyClient } from '../shared/api';
import { getAccessToken } from '../shared/session';

const Authorize = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const clientId = query.get('clientId');
    const redirectURI = query.get('redirectURI');

    if (!clientId) {
      setError('clientId is not provided');
      return;
    }

    if (!redirectURI) {
      setError('redirectURI is not provided');
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      navigate('/login', { state: { clientId, redirectURI } });
      return;
    }

    verifyClient({ clientId, redirectURI })
      .then(({ valid }) => {
        if (!valid) throw new Error('Invalid clienId or redirectURI');
        return getAuthCode(clientId);
      })
      .then(({ authCode }) => {
        const search = new URLSearchParams({ authCode, status: 'success' });
        window.location.href = `${redirectURI}?${search.toString()}`;
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to verify client');
        setTimeout(() => {
          const search = new URLSearchParams({ error: err.message, status: 'failed' });
          window.location.href = `${redirectURI}?${search.toString()}`;
        }, 5000);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [navigate, search]);

  return (
    <div
      className={clsx('authorize', {
        'has-error': Boolean(error),
      })}
    >
      {error && (
        <div className="authorize__error">
          <ErrorIcon className="authorize__icon" />
          <span>{error}</span>
        </div>
      )}
      {!error && isVerifying && <Loader className="authorize__loader" />}
    </div>
  );
};

export default Authorize;
