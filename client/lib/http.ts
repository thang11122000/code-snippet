import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { defaultLocale } from "./i18n";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const REQUEST_TIMEOUT = 10_000;

type TokenResolver = () => string | null | undefined;
type LocaleResolver = () => string | null | undefined;
type ErrorLogger = (error: ApiError) => void;

const defaultTokenResolver: TokenResolver = () => null;

const defaultLocaleResolver: LocaleResolver = () => defaultLocale;

let authTokenResolver: TokenResolver = defaultTokenResolver;
let localeResolver: LocaleResolver = defaultLocaleResolver;
let apiErrorLogger: ErrorLogger = (error) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[API] ${error.status} ${error.message}`, error);
  }
};

export class ApiError extends Error {
  status: number;
  data?: unknown;
  isNetworkError: boolean;
  cause?: unknown;

  constructor(params: {
    message: string;
    status: number;
    data?: unknown;
    isNetworkError?: boolean;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.data = params.data;
    this.isNetworkError = Boolean(params.isNetworkError);
    this.cause = params.cause;
  }
}

const extractMessage = (payload: unknown): string | undefined => {
  if (!payload) {
    return undefined;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (payload instanceof Error) {
    return payload.message;
  }

  if (typeof payload === "object") {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }

    const errors = (payload as { errors?: Array<{ message?: string }> }).errors;
    if (Array.isArray(errors)) {
      const first = errors.find((entry) => typeof entry?.message === "string");
      if (first?.message) {
        return first.message;
      }
    }
  }

  return undefined;
};

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status =
      error.response?.status ?? (error.code === "ECONNABORTED" ? 408 : 0);
    const responseData = error.response?.data;
    const message =
      extractMessage(responseData) ?? error.message ?? "Unexpected API error";

    return new ApiError({
      message,
      status,
      data: responseData,
      isNetworkError: !error.response,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      status: 0,
      cause: error,
    });
  }

  return new ApiError({
    message: "Unexpected error",
    status: 0,
    data: error,
  });
}

export function setAuthTokenResolver(resolver: TokenResolver | null) {
  authTokenResolver = resolver ?? defaultTokenResolver;
}

export function setLocaleResolver(resolver: LocaleResolver | null) {
  localeResolver = resolver ?? defaultLocaleResolver;
}

export function setApiErrorLogger(logger: ErrorLogger | null) {
  apiErrorLogger = logger ?? (() => undefined);
}

const applyInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const updatedConfig = { ...config };
    updatedConfig.headers = axios.AxiosHeaders.from(config.headers);

    const token = authTokenResolver?.();
    if (token) {
      updatedConfig.headers.set("Authorization", `Bearer ${token}`);
    } else {
      updatedConfig.headers.delete("Authorization");
    }

    const language = localeResolver?.();
    if (language) {
      updatedConfig.headers.set("Accept-Language", language);
    }

    return updatedConfig;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError | unknown) => {
      const normalizedError = normalizeApiError(error);

      apiErrorLogger?.(normalizedError);

      return Promise.reject(normalizedError);
    }
  );
};

const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const { headers: configHeaders, ...restConfig } = config ?? {};

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    withCredentials: true,
    ...restConfig,
  });

  instance.defaults.headers.common = axios.AxiosHeaders.from({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  if (configHeaders) {
    instance.defaults.headers.common = axios.AxiosHeaders.from({
      ...instance.defaults.headers.common.toJSON(),
      ...configHeaders,
    });
  }

  applyInterceptors(instance);
  return instance;
};

export const apiClient = createAxiosInstance();

const serviceApiKey = process.env.NEXT_PUBLIC_SERVICE_API_KEY;
export const authApiClient = createAxiosInstance(
  serviceApiKey
    ? {
        headers: {
          "x-service-key": serviceApiKey,
        },
      }
    : undefined
);

export const createApiClient = (config?: AxiosRequestConfig) =>
  createAxiosInstance(config);

export const createServerApiClient = (
  config?: AxiosRequestConfig,
  headers?: Record<string, string>
): AxiosInstance =>
  createAxiosInstance({
    ...config,
    headers: {
      ...config?.headers,
      ...headers,
    },
  });
