const USER_KEY = 'users';

const getAllUsers = () => {
  return JSON.parse(localStorage.getItem(USER_KEY)) || [];
};

const saveAllUsers = (users) => {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
};

// 📥 Đăng nhập hoặc đăng ký bằng email
export const handleEmailAuth = async (values, mode) => {
  const users = getAllUsers();

  if (mode === 'login') {
    const user = users.find(u => u.email === values.email && u.password === values.password);
    if (!user) throw new Error('Sai thông tin');
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    if (users.some(u => u.email === values.email)) {
      throw new Error('Email đã sử dụng');
    }
    const newUser = {
      ...values,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveAllUsers(users);
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(newUser));
  }
};

// 📥 Đăng nhập bằng Google OAuth (token từ Google One Tap)
export const handleGoogleAuth = async (resp) => {
  const decoded = JSON.parse(atob(resp.credential.split('.')[1]));
  const user = {
    name: decoded.name,
    email: decoded.email,
    createdAt: new Date().toISOString(),
  };

  const users = getAllUsers();
  const existed = users.find(u => u.email === user.email);

  if (existed) {
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(existed));
  } else {
    const newUser = { ...user, id: Date.now() };
    users.push(newUser);
    saveAllUsers(users);
    localStorage.setItem('token', 'ok');
    localStorage.setItem('user', JSON.stringify(newUser));
  }
};

// 📥 Lấy toàn bộ danh sách người dùng (chỉ dùng cho quản trị hoặc hiển thị)
export const fetchUsers = async () => {
  return getAllUsers();
};
