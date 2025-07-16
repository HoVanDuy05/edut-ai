import axios from 'axios';

const API = 'http://localhost:3001/users';

export const handleEmailAuth = async (values, mode) => {
  const { data } = await axios.get(API);

  if (mode === 'login') {
    const user = data.find(u => u.email === values.email && u.password === values.password);
    if (!user) throw new Error('Sai thông tin');
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    if (data.some(u => u.email === values.email)) throw new Error('Email đã sử dụng');
    const newU = { ...values, id: Date.now(), createdAt: new Date().toISOString() };
    await axios.post(API, newU);
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(newU));
  }
};

export const handleGoogleAuth = async (resp) => {
  const decoded = JSON.parse(atob(resp.credential.split('.')[1]));
  const user = {
    name: decoded.name,
    email: decoded.email,
    createdAt: new Date().toISOString(),
  };

  const { data } = await axios.get(API);
  const existed = data.find(u => u.email === user.email);

  if (existed) {
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(existed));
  } else {

    const newUser = { ...user, id: Date.now() };
    await axios.post(API, newUser);
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(newUser));
  }
};

export const fetchUsers = async () => {
  const { data } = await axios.get(API);
  return data;
};