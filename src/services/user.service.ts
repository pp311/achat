import type { LoginResponse, RegisterUser } from '@/types/user'
import ApiService from '@/services/api.service'

export const userService = {
  login,
  logout,
  register,
};

async function login(email : string, password : string, isRemember : boolean) {
  const response = await ApiService.axiosCall<LoginResponse>({
    method: 'POST',
    url: '/auth/login',
    data: { email, password }
  });

  if (response.accessToken) {
    updateCredLocalStorage(response, isRemember);
    updateCredSessionStorage(response, isRemember);
  }
  else {
    throw new Error('Wrong email or password');
  }

  return response.user;
}

function logout() {
  // xoá user từ local storage để log out
  localStorage.removeItem('user');
}

function updateCredLocalStorage(response : LoginResponse, isRemember : boolean) {
  if (isRemember) {
    localStorage.setItem('token', response.accessToken!);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('role', response.role);
    localStorage.setItem('refreshToken', response.refreshToken);
  }
  else {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('refreshToken');
  }
}

function updateCredSessionStorage(response : LoginResponse, isRemember : boolean) {
  if (isRemember) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('refreshToken');
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('refreshToken');
  }
}

async function register(request : Omit<RegisterUser, 'confirmPassword'>) {
  await ApiService.axiosCall({
    method: 'POST',
    url: '/auth/register',
    data: request
  });
}
