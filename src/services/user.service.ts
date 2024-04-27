import type { LoginResponse, RegisterUser } from '@/types/user'
import ApiService from '@/services/api.service'

export const userService = {
  login,
  logout,
  register,
  googleAuthenticate
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
  ApiService.axiosCall({
    method: 'POST',
    url: '/auth/revoke-token',
    data: { refreshToken: localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') }
  });

  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  sessionStorage.removeItem('role');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('refreshToken');

}

function updateCredLocalStorage(response : LoginResponse, isRemember : boolean) {
  if (isRemember) {
    localStorage.setItem('token', response.accessToken!);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('role', response.role);
    localStorage.setItem('refreshToken', response.refreshToken);
  }
  else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('refreshToken');
  }
}

function updateCredSessionStorage(response : LoginResponse, isRemember : boolean) {
  if (!isRemember) {
    sessionStorage.setItem('token', response.accessToken!);
    sessionStorage.setItem('user', JSON.stringify(response.user));
    sessionStorage.setItem('role', response.role);
    sessionStorage.setItem('refreshToken', response.refreshToken);
  } else {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('refreshToken');
  }
}

async function register(request : Omit<RegisterUser, 'confirmPassword'>) {
  await ApiService.axiosCall({
    method: 'POST',
    url: '/auth/register',
    data: request
  });
}

async function googleAuthenticate(accessToken : string) {
  const response = await ApiService.axiosCall<LoginResponse>({
    method: 'POST',
    url: `/auth/google-login?accessToken=${accessToken}`
  });

  if (response.accessToken) {
    updateCredLocalStorage(response, true);
    updateCredSessionStorage(response, true);
  }
  else {
    throw new Error('Something bad happened. Please try again later.');
  }

  return response.user;
}
