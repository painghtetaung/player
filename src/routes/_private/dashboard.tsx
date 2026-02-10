import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth'
import { User, Mail, Shield } from 'lucide-react'

export const Route = createFileRoute('/_private/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your protected dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">User Name</p>
                <p className="text-xl font-semibold text-gray-900">{user?.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-xl font-semibold text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Protected Content</h2>
          <p className="text-gray-600 mb-4">
            This is a protected route that can only be accessed by authenticated users.
            If you try to access this page without being logged in, you'll be redirected
            to the login page.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-indigo-800 font-medium">🔒 Route Protection Active</p>
            <p className="text-indigo-700 text-sm mt-1">
              This page is protected by the <code className="px-2 py-1 bg-indigo-100 rounded">_private</code> layout route.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
