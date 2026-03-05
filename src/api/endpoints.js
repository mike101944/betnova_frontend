// src/api/endpoints.js

/**
 * API Endpoints
 * Centralized location for all API endpoint constants
 */

// ============= AUTH ENDPOINTS =============
export const AUTH = {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    CHANGE_PASSWORD: '/auth/change-password',
    
    // Profile
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    UPDATE_AVATAR: '/auth/avatar',
    DELETE_ACCOUNT: '/auth/account'
  }
  
  // ============= USERS ENDPOINTS =============
  export const USERS = {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    BETS: (id) => `/users/${id}/bets`,
    DEPOSITS: (id) => `/users/${id}/deposits`,
    WITHDRAWALS: (id) => `/users/${id}/withdrawals`,
    TRANSACTIONS: (id) => `/users/${id}/transactions`,
    STATISTICS: (id) => `/users/${id}/statistics`,
    KYC: (id) => `/users/${id}/kyc`
  }
  
  // ============= MATCHES ENDPOINTS =============
  export const MATCHES = {
    BASE: '/matches',
    BY_ID: (id) => `/matches/${id}`,
    LIVE: '/matches/live',
    UPCOMING: '/matches/upcoming',
    FINISHED: '/matches/finished',
    BY_LEAGUE: (leagueId) => `/matches/league/${leagueId}`,
    BY_DATE: (date) => `/matches/date/${date}`,
    STATISTICS: (id) => `/matches/${id}/statistics`,
    ODDS: (id) => `/matches/${id}/odds`,
    HISTORY: (id) => `/matches/${id}/history`
  }
  
  // ============= LEAGUES ENDPOINTS =============
  export const LEAGUES = {
    BASE: '/leagues',
    BY_ID: (id) => `/leagues/${id}`,
    POPULAR: '/leagues/popular',
    BY_SPORT: (sport) => `/leagues/sport/${sport}`,
    STANDINGS: (id) => `/leagues/${id}/standings`,
    TOP_SCORERS: (id) => `/leagues/${id}/top-scorers`
  }
  
  // ============= BETS ENDPOINTS =============
  export const BETS = {
    BASE: '/bets',
    BY_ID: (id) => `/bets/${id}`,
    PLACE: '/bets/place',
    HISTORY: '/bets/history',
    PENDING: '/bets/pending',
    SETTLED: '/bets/settled',
    CASH_OUT: (id) => `/bets/${id}/cash-out`,
    BOOKING_CODE: '/bets/booking-code',
    LOAD_BOOKING: (code) => `/bets/booking/${code}`,
    STATISTICS: '/bets/statistics'
  }
  
  // ============= DEPOSITS ENDPOINTS =============
  export const DEPOSITS = {
    BASE: '/deposits',
    BY_ID: (id) => `/deposits/${id}`,
    METHODS: '/deposits/methods',
    REQUEST: '/deposits/request',
    UPLOAD_PROOF: (id) => `/deposits/${id}/proof`,
    AGENT_REQUESTS: '/deposits/agent/pending',
    APPROVE: (id) => `/deposits/${id}/approve`,
    REJECT: (id) => `/deposits/${id}/reject`,
    HISTORY: '/deposits/history',
    STATISTICS: '/deposits/statistics'
  }
  
  // ============= WITHDRAWALS ENDPOINTS =============
  export const WITHDRAWALS = {
    BASE: '/withdrawals',
    BY_ID: (id) => `/withdrawals/${id}`,
    METHODS: '/withdrawals/methods',
    REQUEST: '/withdrawals/request',
    APPROVE: (id) => `/withdrawals/${id}/approve`,
    REJECT: (id) => `/withdrawals/${id}/reject`,
    HISTORY: '/withdrawals/history'
  }
  
  // ============= AGENTS ENDPOINTS =============
  export const AGENTS = {
    BASE: '/agents',
    BY_ID: (id) => `/agents/${id}`,
    LOGIN: '/agents/login',
    DASHBOARD: '/agents/dashboard',
    DEPOSITS: '/agents/deposits',
    COMMISSIONS: '/agents/commissions',
    CLIENTS: '/agents/clients',
    CLIENT_DETAILS: (id) => `/agents/clients/${id}`,
    TRANSACTIONS: '/agents/transactions',
    STATISTICS: '/agents/statistics'
  }
  
  // ============= TRANSACTIONS ENDPOINTS =============
  export const TRANSACTIONS = {
    BASE: '/transactions',
    BY_ID: (id) => `/transactions/${id}`,
    HISTORY: '/transactions/history',
    SUMMARY: '/transactions/summary',
    EXPORT: '/transactions/export'
  }
  
  // ============= NOTIFICATIONS ENDPOINTS =============
  export const NOTIFICATIONS = {
    BASE: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    UNREAD: '/notifications/unread',
    SETTINGS: '/notifications/settings'
  }
  
  // ============= PAYMENTS ENDPOINTS =============
  export const PAYMENTS = {
    BASE: '/payments',
    METHODS: '/payments/methods',
    RATES: '/payments/exchange-rates',
    VERIFY: '/payments/verify',
    CALLBACK: '/payments/callback'
  }
  
  // ============= ADMIN ENDPOINTS =============
  export const ADMIN = {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/users/${id}`,
    AGENTS: '/admin/agents',
    AGENT_BY_ID: (id) => `/admin/agents/${id}`,
    DEPOSITS: '/admin/deposits',
    WITHDRAWALS: '/admin/withdrawals',
    MATCHES: '/admin/matches',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs'
  }
  
  // ============= SYSTEM ENDPOINTS =============
  export const SYSTEM = {
    HEALTH: '/system/health',
    STATISTICS: '/system/statistics',
    VERSION: '/system/version',
    CONFIG: '/system/config',
    MAINTENANCE: '/system/maintenance'
  }
  
  // ============= SPORTS ENDPOINTS =============
  export const SPORTS = {
    BASE: '/sports',
    BY_ID: (id) => `/sports/${id}`,
    POPULAR: '/sports/popular',
    COUNTRIES: '/sports/countries'
  }
  
  // ============= VIRTUAL SPORTS ENDPOINTS =============
  export const VIRTUAL = {
    BASE: '/virtual',
    MATCHES: '/virtual/matches',
    BY_ID: (id) => `/virtual/matches/${id}`,
    LEAGUES: '/virtual/leagues',
    RESULTS: '/virtual/results',
    SCHEDULE: '/virtual/schedule'
  }
  
  // ============= BOOKING CODES ENDPOINTS =============
  export const BOOKING = {
    BASE: '/booking',
    GENERATE: '/booking/generate',
    LOAD: (code) => `/booking/${code}`,
    VERIFY: (code) => `/booking/${code}/verify`,
    SHARE: (code) => `/booking/${code}/share`
  }
  
  // Export all endpoints as a single object
  export default {
    AUTH,
    USERS,
    MATCHES,
    LEAGUES,
    BETS,
    DEPOSITS,
    WITHDRAWALS,
    AGENTS,
    TRANSACTIONS,
    NOTIFICATIONS,
    PAYMENTS,
    ADMIN,
    SYSTEM,
    SPORTS,
    VIRTUAL,
    BOOKING
  }