import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import api from '../api';
const API_URL = import.meta.env.VITE_API_URL;

export default class Store {
  constructor() {
    this.user = {};
    this.error = null;
    this.isAuth = !!localStorage.getItem('token');
    this.isActivated = localStorage.getItem('isActivated');
    this.isLoading = false;
    makeAutoObservable(this);
  }

  setError(serverError) {
    this.error = serverError;
  }

  setIsActivated(bool) {
    this.isActivated = bool;
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setUser(user) {
    this.user = user;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  async registration(email, password) {
    try {
      const response = await api.post(`${API_URL}/registration`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('isActivated', response.data.user.isActivated);
    } catch (e) {
      this.setError(e.response?.data.message);
    }
  }

  async login(email, password) {
    try {
      const response = await api.post(`${API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('isActivated', response.data.user.isActivated);
    } catch (e) {
      this.setError(e.response?.data.message);
    }
  }

  async logout() {
    try {
      await api.post(`${API_URL}/logout`, null, {
        withCredentials: true,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('isActivated');
      this.setAuth(false);
      this.setUser({});
    } catch (e) {
      this.setError(e.response?.data.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('isActivated', response.data.user.isActivated);
    } catch (e) {
      this.setError(e.response?.data.message);
    } finally {
      this.setLoading(false);
    }
  }
}
