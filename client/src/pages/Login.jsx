import { observer } from 'mobx-react-lite';
import LoginForm from '../components/loginForm';

const Login = () => {
  return (
    <div className="container">
      <h1>Home Page</h1>
      <p className="text">
        Hello Guest, authorization is required, you need to login or register.
      </p>
      <LoginForm />
    </div>
  );
};

export default observer(Login);
