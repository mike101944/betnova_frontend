// ============================================
// DUMMY DATA FOR BETTING SYSTEM
// ============================================

// ---------- USERS & CUSTOMERS ----------
export const dummyUsers = {
  customers: [
    {
      id: 'CUST-001',
      name: 'John Mwangi',
      email: 'john.mwangi@example.com',
      phone: '0712345678',
      balance: 25000,
      bonus: 500,
      tier: 'gold',
      registeredAt: '2025-01-15T10:30:00Z',
      lastLogin: '2025-03-16T14:20:00Z',
      betsPlaced: 145,
      betsWon: 78,
      totalWon: 345000,
      kycStatus: 'verified'
    },
    {
      id: 'CUST-002',
      name: 'Sarah Omondi',
      email: 'sarah.omondi@example.com',
      phone: '0723456789',
      balance: 12500,
      bonus: 200,
      tier: 'silver',
      registeredAt: '2025-02-01T09:15:00Z',
      lastLogin: '2025-03-16T11:45:00Z',
      betsPlaced: 67,
      betsWon: 31,
      totalWon: 89000,
      kycStatus: 'pending'
    },
    {
      id: 'CUST-003',
      name: 'David Otieno',
      email: 'david.otieno@example.com',
      phone: '0734567890',
      balance: 50000,
      bonus: 1000,
      tier: 'platinum',
      registeredAt: '2024-12-10T14:20:00Z',
      lastLogin: '2025-03-16T09:30:00Z',
      betsPlaced: 234,
      betsWon: 142,
      totalWon: 567000,
      kycStatus: 'verified'
    }
  ],
  
  agents: [
    {
      id: 'AG-001',
      name: 'Salim Mwinyi',
      phone: '0745678901',
      email: 'salim.mwinyi@agent.com',
      location: 'Dar es Salaam',
      balance: 500000,
      commission: 5,
      totalClients: 234,
      totalDeposits: 12500000,
      status: 'active',
      joinedAt: '2024-06-01T08:00:00Z'
    },
    {
      id: 'AG-002',
      name: 'Aisha Juma',
      phone: '0756789012',
      email: 'aisha.juma@agent.com',
      location: 'Arusha',
      balance: 350000,
      commission: 5,
      totalClients: 156,
      totalDeposits: 7800000,
      status: 'active',
      joinedAt: '2024-07-15T10:30:00Z'
    },
    {
      id: 'AG-003',
      name: 'James Kipchoge',
      phone: '0767890123',
      email: 'james.kipchoge@agent.com',
      location: 'Mombasa',
      balance: 420000,
      commission: 5.5,
      totalClients: 189,
      totalDeposits: 9500000,
      status: 'active',
      joinedAt: '2024-08-20T09:15:00Z'
    }
  ]
}

// ---------- MATCHES ----------
export const dummyMatches = [
  {
    id: 'MATCH-001',
    league: 'PREMIER LEAGUE',
    leagueId: 'PL-2025',
    homeTeam: 'Manchester United',
    awayTeam: 'Chelsea',
    homeLogo: 'man-utd.png',
    awayLogo: 'chelsea.png',
    startTime: '2025-03-16T19:45:00Z',
    isLive: true,
    currentMinute: 67,
    score: '2 - 1',
    status: 'live',
    odds: {
      '1': { id: 'ODD-001-1', label: '1', value: 2.50, market: '1X2' },
      'X': { id: 'ODD-001-X', label: 'X', value: 3.20, market: '1X2' },
      '2': { id: 'ODD-001-2', label: '2', value: 2.80, market: '1X2' },
      'over25': { id: 'ODD-001-OV', label: 'Over 2.5', value: 1.95, market: 'goals' },
      'under25': { id: 'ODD-001-UN', label: 'Under 2.5', value: 1.85, market: 'goals' },
      'gg': { id: 'ODD-001-GG', label: 'GG', value: 1.90, market: 'bothToScore' },
      'ng': { id: 'ODD-001-NG', label: 'NG', value: 1.90, market: 'bothToScore' }
    },
    moreMarkets: 23,
    statistics: {
      possession: [52, 48],
      shots: [14, 9],
      shotsOnTarget: [6, 4],
      corners: [5, 3],
      fouls: [8, 11]
    }
  },
  {
    id: 'MATCH-002',
    league: 'LA LIGA',
    leagueId: 'LL-2025',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeLogo: 'real-madrid.png',
    awayLogo: 'barcelona.png',
    startTime: '2025-03-16T20:00:00Z',
    isLive: false,
    status: 'upcoming',
    odds: {
      '1': { id: 'ODD-002-1', label: '1', value: 2.10, market: '1X2' },
      'X': { id: 'ODD-002-X', label: 'X', value: 3.40, market: '1X2' },
      '2': { id: 'ODD-002-2', label: '2', value: 3.20, market: '1X2' },
      'over25': { id: 'ODD-002-OV', label: 'Over 2.5', value: 1.85, market: 'goals' },
      'under25': { id: 'ODD-002-UN', label: 'Under 2.5', value: 1.95, market: 'goals' }
    },
    moreMarkets: 18
  },
  {
    id: 'MATCH-003',
    league: 'SERIE A',
    leagueId: 'SA-2025',
    homeTeam: 'Inter Milan',
    awayTeam: 'AC Milan',
    homeLogo: 'inter.png',
    awayLogo: 'milan.png',
    startTime: '2025-03-16T21:30:00Z',
    isLive: false,
    status: 'upcoming',
    odds: {
      '1': { id: 'ODD-003-1', label: '1', value: 2.30, market: '1X2' },
      'X': { id: 'ODD-003-X', label: 'X', value: 3.10, market: '1X2' },
      '2': { id: 'ODD-003-2', label: '2', value: 3.00, market: '1X2' },
      'over25': { id: 'ODD-003-OV', label: 'Over 2.5', value: 1.95, market: 'goals' },
      'under25': { id: 'ODD-003-UN', label: 'Under 2.5', value: 1.85, market: 'goals' }
    },
    moreMarkets: 15
  },
  {
    id: 'MATCH-004',
    league: 'BUNDESLIGA',
    leagueId: 'BL-2025',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeLogo: 'bayern.png',
    awayLogo: 'dortmund.png',
    startTime: '2025-03-16T18:30:00Z',
    isLive: true,
    currentMinute: 32,
    score: '1 - 0',
    status: 'live',
    odds: {
      '1': { id: 'ODD-004-1', label: '1', value: 1.85, market: '1X2' },
      'X': { id: 'ODD-004-X', label: 'X', value: 3.60, market: '1X2' },
      '2': { id: 'ODD-004-2', label: '2', value: 4.20, market: '1X2' },
      'over25': { id: 'ODD-004-OV', label: 'Over 2.5', value: 1.75, market: 'goals' },
      'under25': { id: 'ODD-004-UN', label: 'Under 2.5', value: 2.05, market: 'goals' }
    },
    moreMarkets: 20,
    statistics: {
      possession: [58, 42],
      shots: [8, 4],
      shotsOnTarget: [3, 1],
      corners: [4, 2],
      fouls: [5, 7]
    }
  }
]

// ---------- BETS ----------
export const dummyBets = [
  {
    id: 'BET-20250316-001',
    userId: 'CUST-001',
    userName: 'John Mwangi',
    selections: [
      {
        matchId: 'MATCH-001',
        match: 'Manchester United vs Chelsea',
        selection: '1',
        odds: 2.50,
        market: '1X2',
        status: 'pending'
      }
    ],
    stake: 1000,
    totalOdds: 2.50,
    potentialWin: 2500,
    placedAt: '2025-03-16T14:23:15Z',
    status: 'pending',
    bookingCode: 'MK12345678',
    isVirtual: false
  },
  {
    id: 'BET-20250316-002',
    userId: 'CUST-002',
    userName: 'Sarah Omondi',
    selections: [
      {
        matchId: 'MATCH-004',
        match: 'Bayern Munich vs Borussia Dortmund',
        selection: '1',
        odds: 1.85,
        market: '1X2',
        status: 'pending'
      },
      {
        matchId: 'MATCH-002',
        match: 'Real Madrid vs Barcelona',
        selection: 'X',
        odds: 3.40,
        market: '1X2',
        status: 'pending'
      }
    ],
    stake: 500,
    totalOdds: 6.29,
    potentialWin: 3145,
    placedAt: '2025-03-16T15:10:22Z',
    status: 'pending',
    bookingCode: 'MK87654321',
    isVirtual: false
  },
  {
    id: 'BET-20250315-001',
    userId: 'CUST-003',
    userName: 'David Otieno',
    selections: [
      {
        matchId: 'MATCH-003',
        match: 'Inter Milan vs AC Milan',
        selection: 'Over 2.5',
        odds: 1.95,
        market: 'goals',
        status: 'won'
      }
    ],
    stake: 2000,
    totalOdds: 1.95,
    potentialWin: 3900,
    placedAt: '2025-03-15T19:45:00Z',
    status: 'won',
    bookingCode: 'MK55555555',
    isVirtual: false
  }
]

// ---------- BOOKING CODES ----------
export const dummyBookingCodes = {
  'MK12345678': {
    code: 'MK12345678',
    selections: [
      {
        matchId: 'MATCH-001',
        match: 'Manchester United vs Chelsea',
        selection: '1',
        odds: 2.50,
        market: '1X2'
      }
    ],
    totalOdds: 2.50,
    createdAt: '2025-03-16T14:23:15Z',
    createdBy: 'CUST-001',
    status: 'active'
  },
  'MK87654321': {
    code: 'MK87654321',
    selections: [
      {
        matchId: 'MATCH-004',
        match: 'Bayern Munich vs Borussia Dortmund',
        selection: '1',
        odds: 1.85,
        market: '1X2'
      },
      {
        matchId: 'MATCH-002',
        match: 'Real Madrid vs Barcelona',
        selection: 'X',
        odds: 3.40,
        market: '1X2'
      }
    ],
    totalOdds: 6.29,
    createdAt: '2025-03-16T15:10:22Z',
    createdBy: 'CUST-002',
    status: 'active'
  }
}

// ---------- DEPOSIT REQUESTS ----------
export const dummyDepositRequests = [
  {
    id: 'DEP-20250316-001',
    userId: 'CUST-001',
    userName: 'John Mwangi',
    amount: 50000,
    method: 'M-PESA',
    transactionId: 'RKL7G8H9J0',
    phoneNumber: '0712345678',
    imageProof: '/uploads/payments/proof-001.jpg',
    status: 'pending',
    submittedAt: '2025-03-16T09:23:15Z',
    agentId: null,
    agentName: null,
    notes: '',
    adminNotes: ''
  },
  {
    id: 'DEP-20250316-002',
    userId: 'CUST-002',
    userName: 'Sarah Omondi',
    amount: 25000,
    method: 'TIGO PESA',
    transactionId: 'TXL789012345',
    phoneNumber: '0723456789',
    imageProof: '/uploads/payments/proof-002.jpg',
    status: 'pending',
    submittedAt: '2025-03-16T10:45:30Z',
    agentId: null,
    agentName: null,
    notes: 'Via agent Salim',
    adminNotes: ''
  },
  {
    id: 'DEP-20250316-003',
    userId: 'CUST-003',
    userName: 'David Otieno',
    amount: 100000,
    method: 'AIRTEL MONEY',
    transactionId: 'AIR456789123',
    phoneNumber: '0734567890',
    imageProof: '/uploads/payments/proof-003.jpg',
    status: 'approved',
    submittedAt: '2025-03-16T08:12:45Z',
    approvedAt: '2025-03-16T08:25:10Z',
    agentId: 'AG-001',
    agentName: 'Salim Mwinyi',
    notes: '',
    adminNotes: ''
  },
  {
    id: 'DEP-20250315-001',
    userId: 'CUST-001',
    userName: 'John Mwangi',
    amount: 20000,
    method: 'M-PESA',
    transactionId: 'MPE123456789',
    phoneNumber: '0712345678',
    imageProof: '/uploads/payments/proof-004.jpg',
    status: 'approved',
    submittedAt: '2025-03-15T14:20:00Z',
    approvedAt: '2025-03-15T14:35:22Z',
    agentId: 'AG-002',
    agentName: 'Aisha Juma',
    notes: '',
    adminNotes: ''
  }
]

// ============================================
// DEFAULT EXPORT - Yote kwa pamoja
// ============================================
export default {
  dummyUsers,
  dummyMatches,
  dummyBets,
  dummyBookingCodes,
  dummyDepositRequests
}