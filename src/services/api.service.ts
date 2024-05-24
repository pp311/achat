import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useGlobalStore } from '@/stores/global'

class ApiService {
  private axiosInstance: AxiosInstance;
  private errorHandler : Function | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;

      if (error.response.status == 401) {
        const refreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');
        if (!refreshToken) {
          location.replace('/login?isFromOtherUrl=true')
        }

        this.axiosInstance
          .post<{accessToken: string, refreshToken : string}>(`/auth/refresh?refreshToken=${refreshToken}`)
          .then((response) => {
            if (response.data.accessToken) {
              if (sessionStorage.getItem('token')) {
                sessionStorage.setItem('token', response.data.accessToken);
                sessionStorage.setItem('refreshToken', response.data.refreshToken);
              } else {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
              }

              originalRequest.headers.Authorization =`Bearer ${response.data.accessToken}`;
              this.axiosInstance(originalRequest)
                .then(data => data.data)
                .catch((error) => {
                  if (this.errorHandler)
                    this.errorHandler(error.response.data.title)
                  else
                    console.error(error.response.data);
                  throw new Error(error.response.data.title);
                });
            }
          })
          .catch((error) => {
            if (this.errorHandler)
              this.errorHandler(error.response.data.title)
            else
              console.error(error.response.data);
            throw new Error(error.response.data.title);
          });
      }
      if (this.errorHandler)
        this.errorHandler(error.response.data.title)
      else
        console.error(error.response.data);
      return error;
    });
  }

  public async axiosCall<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const data = await this.axiosInstance.request<T>(config);
      console.log(data.data)

      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async axiosCallWithAuth<T>(
    config: AxiosRequestConfig,
    errorHandler : Function | null = null) : Promise<T> {
    this.errorHandler = errorHandler;
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        location.replace('/login?isFromOtherUrl=true')
      }

      const data = await this.axiosInstance.request<T>({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(data)
      //
      // if (data.status == 401) {
      //   const refreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');
      //   if (!refreshToken) {
      //     location.replace('/login?isFromOtherUrl=true')
      //   }
      //
      //   const response = await this.axiosInstance.post<{accessToken: string, refreshToken : string}>(`/auth/refresh?refreshToken=${refreshToken}`);
      //
      //   if (response.data.accessToken) {
      //     if (sessionStorage.getItem('token')) {
      //       sessionStorage.setItem('token', response.data.accessToken);
      //       sessionStorage.setItem('refreshToken', response.data.refreshToken);
      //     }
      //     else {
      //       localStorage.setItem('token', response.data.accessToken);
      //       localStorage.setItem('refreshToken', response.data.refreshToken);
      //     }
      //   }
      //
      //   data = await this.axiosInstance.request<T>({
      //     ...config,
      //     headers: {
      //       ...config.headers,
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      // }

      return data.data;
    } catch (error : any) {
      if (errorHandler)
        errorHandler(error.response.data.title)
      else
        console.error(error.response.data);
      throw new Error(error.response.data.title);
    }
  }
}


export default new ApiService();
