export const mockWalletData = {
  balance: "1000.00000000",
  stakeBalance: "500.00000000",
  depositAddress: "5GC7nxJ4ZnXv8K9L2mP3yQr6HN8E4v2kM",
  transactions: [
    { id: 1, type: "deposit", amount: "100.00000000", datetime: "2023-09-01T10:00:00Z" },
    { id: 2, type: "stake", amount: "500.00000000", datetime: "2023-09-02T15:30:00Z" },
    { id: 3, type: "tip (sent)", amount: "50.00000000", datetime: "2023-09-03T09:15:00Z" }
  ]
}

export const mockAdminData = {
  totalUsers: 150,
  totalBalance: "25000.00000000",
  totalStaked: "12500.00000000",
  activeUsers: 45,
  recentTransactions: [
    { id: 1, username: "user1", type: "deposit", amount: "100.00000000", datetime: "2023-09-01T10:00:00Z" },
    { id: 2, username: "user2", type: "stake", amount: "500.00000000", datetime: "2023-09-02T15:30:00Z" }
  ],
  topHolders: [
    { id: 1, username: "user1", balance: "5000.00000000", stakeBalance: "2500.00000000" },
    { id: 2, username: "user2", balance: "3000.00000000", stakeBalance: "1500.00000000" }
  ]
}