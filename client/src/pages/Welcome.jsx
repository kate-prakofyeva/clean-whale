import { useContext, useEffect, useState } from 'react';
import { Context } from '../main';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import api from '../api';

const Welcome = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { store } = useContext(Context);

  const email = localStorage.getItem('email');
  const isActivated = localStorage.getItem('isActivated');

  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (e) {
      setError(e);
    }
  };

  const handleLogOut = () => {
    try {
      store.logout();
      navigate('/login');
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div className="container">
      <h2>
        Hello <i>{email}!</i>
      </h2>

      {isActivated === 'true' ? (
        <p className="text">Account activated</p>
      ) : (
        <p className="warning-text">
          Please check your email, and activate your account.
        </p>
      )}

      <section>
        <p>You can check other users</p>
        <button className="users-button" onClick={getUsers}>
          users
        </button>

        {error && <div>{error}</div>}

        {users.length > 0 && (
          <ul className="users-list">
            {users.map((user) => (
              <li key={user.email} className="users-item">
                {user.email}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <p>Or you can logout </p>
        <button className="welcome-button" onClick={handleLogOut}>
          Logout
        </button>
      </section>
    </div>
  );
};

export default observer(Welcome);
