import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Customers from './pages/Customers'
import Kanban from './pages/Kanban'
import Employees from './pages/Employees'
import Analytics from './pages/Analytics'
import Purchasing from './pages/Purchasing'
import SalesReturn from './pages/SalesReturn'
import RxReader from './pages/RxReader'
import TitanExplorer from './pages/TitanExplorer'
import AppShell from './components/AppShell'
import './index.css'

// Auth Context
interface User { username: string; role: string; name: string; }
interface AuthCtx { user: User | null; login: (u: User) => void; logout: () => void; }
export const AuthContext = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} })
export const useAuth = () => useContext(AuthContext)

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  return (
    <AuthContext.Provider value={{
      user,
      login: (u) => setUser(u),
      logout: () => setUser(null)
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <AppShell />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
            <Route path="customers" element={<Customers />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="employees" element={<Employees />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="purchasing" element={<Purchasing />} />
            <Route path="sales-return" element={<SalesReturn />} />
            <Route path="rx-reader" element={<RxReader />} />
            <Route path="titan-explorer" element={<TitanExplorer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
