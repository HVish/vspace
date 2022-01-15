import { useLocation, useNavigate } from 'react-router-dom';

export function useClientParams() {
  const { state } = useLocation();
  const navigate = useNavigate();

  function authorize() {
    if ((state as any).clientId && (state as any).redirectURI) {
      const { clientId, redirectURI } = state as any;
      navigate(`/authorize?clientId=${clientId}&redirectURI=${redirectURI}`);
    }
  }

  return { authorize };
}
