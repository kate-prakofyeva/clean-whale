import { useContext, useState } from 'react';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [serverError, setServerError] = useState('');
  const { store } = useContext(Context);
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onChange' });

  const login = async (data) => {
    try {
      await store.login(data.email, data.password);
      if (!store.error) {
        reset();
        navigate('/welcome');
      }
    } catch (error) {
      setServerError(error);
    }
  };

  const registration = async (data) => {
    try {
      await store.registration(data.email, data.password);
      if (!store.error) {
        reset();
        navigate('/welcome');
      }
    } catch (error) {
      setServerError(error);
    }
  };

  return (
    <div className="box">
      <p className="title">Authorization form</p>
      <form className="form">
        <div className="fields">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              className={errors.email && 'input--error'}
              type="email"
              name="email"
              autoComplete="on"
              id="email"
              {...register('email', {
                required: 'Please, fill in the email',
                pattern: {
                  value: /^(?!['`])\s*[-+.'\w]+@[-.\w]+\.[-.\w]+\s*$/gm,
                  message: 'Wrong email format',
                },
                max: { value: 25, message: 'Cannot exceed 254 characters' },
              })}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              className={errors.password && 'input--error'}
              type="password"
              name="password"
              autoComplete="on"
              id="password"
              {...register('password', {
                required: 'Please, fill in the password',
                minLength: {
                  value: 6,
                  message: 'Your password is less than 6',
                },
                maxLength: {
                  value: 25,
                  message: 'Your password is too long',
                },
                pattern: {
                  value: /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/,
                  message: 'Only latin letters, numbers and special characters',
                },
              })}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>
        </div>
        {serverError && <span className="server-error">{serverError}</span>}
        {store.error && <span className="server-error">{store.error}</span>}
        <div className="buttons">
          <button
            type="submit"
            className="button"
            onClick={handleSubmit(login)}
          >
            Login
          </button>
          <p className="text-centered">or</p>
          <button type="submit" onClick={handleSubmit(registration)}>
            Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(LoginForm);
