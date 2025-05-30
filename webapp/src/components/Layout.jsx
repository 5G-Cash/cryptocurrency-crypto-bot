function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">5G-CASH Wallet</h1>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

export default Layout