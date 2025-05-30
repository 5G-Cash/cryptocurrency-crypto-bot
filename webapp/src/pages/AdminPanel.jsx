import { useQuery } from '@tanstack/react-query'
import { mockAdminData } from '../mocks/data'

function AdminPanel() {
  const { data: stats } = useQuery(['admin-stats'], 
    () => Promise.resolve(mockAdminData),
    { initialData: mockAdminData }
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Total Users</h3>
            <p className="text-2xl font-bold">{stats?.totalUsers}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Total Balance</h3>
            <p className="text-2xl font-bold">{stats?.totalBalance} 5G-CASH</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Total Staked</h3>
            <p className="text-2xl font-bold">{stats?.totalStaked} 5G-CASH</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Active Users (24h)</h3>
            <p className="text-2xl font-bold">{stats?.activeUsers}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats?.recentTransactions?.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(tx.datetime).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Top Holders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staked</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats?.topHolders?.map((holder) => (
                    <tr key={holder.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holder.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holder.balance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holder.stakeBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}