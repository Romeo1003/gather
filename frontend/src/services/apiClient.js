import axios from 'axios';


export class ApiClient {
  constructor(baseURL, errorHandler, authProvider) {
    this.instance = axios.create({ baseURL });
    this.errorHandler = errorHandler;
    this.authProvider = authProvider;

    // Request interceptor for headers
    this.instance.interceptors.request.use(config => {
      if (this.authProvider?.getToken()) {
        config.headers.Authorization = `Bearer ${this.authProvider.getToken()}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      response => response,
      error => {
        this.errorHandler?.(error);
        return Promise.reject(error);
      }
    );
  }

  async get(resource) {
    return this.instance.get(resource);
  }

  async post(resource, data) {
    return this.instance.post(resource, data);
  }

  async put(resource, data) {
    return this.instance.put(resource, data);
  }

  async delete(resource) {
    return this.instance.delete(resource);
  }


}

export const createApiClient = (deps) => new ApiClient(
  deps.baseURL,
  deps.errorHandler,
  deps.authProvider
);