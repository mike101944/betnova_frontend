// src/api/config.js

/**
 * API Configuration
 * This file contains all configuration settings for API communication
 */

// Base URL - Change based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://betpaw.co.tz/api/fixtures'

// API Timeouts (in milliseconds)
export const API_TIMEOUT = 30000 // 30 seconds
export const UPLOAD_TIMEOUT = 60000 // 60 seconds for file uploads

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
}

// File upload headers
export const UPLOAD_HEADERS = {
  'Content-Type': 'multipart/form-data',
  'Accept': 'application/json'
}

// API Configuration object
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
  
  // With credentials (cookies, auth headers)
  withCredentials: true,
  
  // Response type
  responseType: 'json',
  
  // Maximum content length
  maxContentLength: 20000000, // 20MB
  maxBodyLength: 20000000, // 20MB
  
  // Validate status
  validateStatus: (status) => {
    return status >= 200 && status < 300
  }
}

// Environment specific configs
export const envConfig = {
  development: {
    baseURL: 'https://betpaw.co.tz/api/fixtures',
    debug: true,
    mockData: true
  },
  staging: {
    baseURL: 'https://betpaw.co.tz/api/fixtures',
    debug: true,
    mockData: false
  },
  production: {
    baseURL: 'https://betpaw.co.tz/api/fixtures',
    debug: false,
    mockData: false
  }
}

// Get current environment config
const currentEnv = import.meta.env.MODE || 'development'
export const currentConfig = envConfig[currentEnv]

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
}

// Cache configuration
export const CACHE_CONFIG = {
  ttl: 300000, // 5 minutes
  maxItems: 100
}

// Retry configuration
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000, // 1 second
  retryStatusCodes: [408, 429, 500, 502, 503, 504]
}

export default apiConfig