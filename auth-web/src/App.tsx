import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Authorize from './pages/Authorize';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="authorize" element={<Authorize />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
