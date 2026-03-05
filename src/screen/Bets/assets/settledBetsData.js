const settledBetsData = [
    {
      id: "9336337628",
      time: "1:21 am",
      date: "Sat 30/08",
      result: "WON",
      stake: 1.00,
      odds: 3.40,
      payout: 3233.11,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M001",
            teams: "Manchester United vs Arsenal",
            market: "1X2",
            selection: "Manchester United",
            odds: 2.10
          },
          {
            id: "M002",
            teams: "Chelsea vs Liverpool",
            market: "Over/Under",
            selection: "Over 2.5",
            odds: 1.62
          }
        ],
        betType: "Accumulator",
        totalOdds: 3.40
      }
    },
    {
      id: "9336337615",
      time: "10:45 pm",
      date: "Fri 29/08",
      result: "LOST",
      stake: 2.50,
      odds: 2.50,
      payout: 12000.00,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M003",
            teams: "Barcelona vs Real Madrid",
            market: "Both Teams to Score",
            selection: "Yes",
            odds: 1.80
          },
          {
            id: "M004",
            teams: "Bayern vs Dortmund",
            market: "1X2",
            selection: "Bayern Munich",
            odds: 1.39
          }
        ],
        betType: "Double",
        totalOdds: 2.50
      }
    },
    {
      id: "9336337599",
      time: "8:15 pm",
      date: "Thu 28/08",
      result: "WON",
      stake: 5.00,
      odds: 1.85,
      payout: 9.25,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M005",
            teams: "AC Milan vs Inter Milan",
            market: "1X2",
            selection: "Draw",
            odds: 3.25
          }
        ],
        betType: "Single",
        totalOdds: 1.85
      }
    },
    {
      id: "9336337583",
      time: "3:30 pm",
      date: "Wed 27/08",
      result: "VOID",
      stake: 3.00,
      odds: 2.20,
      payout: 3.00,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M006",
            teams: "PSG vs Marseille",
            market: "Handicap",
            selection: "PSG -1.5",
            odds: 2.20
          }
        ],
        betType: "Single",
        totalOdds: 2.20
      }
    },
    {
      id: "9336337567",
      time: "11:20 am",
      date: "Tue 26/08",
      result: "WON",
      stake: 10.00,
      odds: 4.50,
      payout: 45.00,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M007",
            teams: "Tottenham vs Manchester City",
            market: "Double Chance",
            selection: "1X",
            odds: 1.50
          },
          {
            id: "M008",
            teams: "Juventus vs Roma",
            market: "Over/Under",
            selection: "Under 3.5",
            odds: 1.30
          },
          {
            id: "M009",
            teams: "Ajax vs Feyenoord",
            market: "1X2",
            selection: "Ajax",
            odds: 2.31
          }
        ],
        betType: "Treble",
        totalOdds: 4.50
      }
    },
    {
      id: "9336337551",
      time: "9:05 pm",
      date: "Mon 25/08",
      result: "LOST",
      stake: 2.00,
      odds: 6.00,
      payout: 0.00,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M010",
            teams: "Atletico Madrid vs Sevilla",
            market: "Correct Score",
            selection: "2-1",
            odds: 8.00
          }
        ],
        betType: "Single",
        totalOdds: 6.00
      }
    },
    {
      id: "9336337535",
      time: "6:45 pm",
      date: "Sun 24/08",
      result: "WON",
      stake: 7.50,
      odds: 2.10,
      payout: 15.75,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M011",
            teams: "Leeds United vs Newcastle",
            market: "Both Teams to Score",
            selection: "No",
            odds: 2.10
          }
        ],
        betType: "Single",
        totalOdds: 2.10
      }
    },
    {
      id: "9336337519",
      time: "4:10 pm",
      date: "Sat 23/08",
      result: "WON",
      stake: 4.00,
      odds: 5.25,
      payout: 21.00,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M012",
            teams: "Everton vs Aston Villa",
            market: "1X2",
            selection: "Everton",
            odds: 2.10
          },
          {
            id: "M013",
            teams: "Leicester vs West Ham",
            market: "Draw No Bet",
            selection: "Leicester",
            odds: 1.75
          },
          {
            id: "M014",
            teams: "Wolves vs Southampton",
            market: "Over/Under",
            selection: "Over 2.5",
            odds: 1.43
          }
        ],
        betType: "Treble",
        totalOdds: 5.25
      }
    },
    {
      id: "9336337503",
      time: "2:55 am",
      date: "Sat 23/08",
      result: "LOST",
      stake: 1.50,
      odds: 3.75,
      payout: 0.00,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M015",
            teams: "Brighton vs Crystal Palace",
            market: "1X2",
            selection: "Crystal Palace",
            odds: 3.75
          }
        ],
        betType: "Single",
        totalOdds: 3.75
      }
    },
    {
      id: "9336337487",
      time: "12:30 am",
      date: "Sat 23/08",
      result: "WON",
      stake: 3.00,
      odds: 2.80,
      payout: 8.40,
      currency: "TSh",
      details: {
        matches: [
          {
            id: "M016",
            teams: "Burnley vs Sheffield United",
            market: "Double Chance",
            selection: "12",
            odds: 1.25
          },
          {
            id: "M017",
            teams: "Fulham vs West Brom",
            market: "1X2",
            selection: "Draw",
            odds: 3.40
          },
          {
            id: "M018",
            teams: "Manchester United vs Leeds",
            market: "Both Teams to Score",
            selection: "Yes",
            odds: 1.65
          }
        ],
        betType: "Treble",
        totalOdds: 2.80
      }
    }
  ];
  
  export default settledBetsData;