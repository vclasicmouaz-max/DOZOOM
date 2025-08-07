'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play } from 'lucide-react'

interface LoginPageProps {
onLogin: (user: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  // Simulate login delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const isOwner = email === '3b6@downer.do' && password === '4u45VC$owneer'
  
  if (isOwner || (email && password)) {
    const user = {
      email,
      isOwner,
      name: isOwner ? 'Owner' : email.split('@')[0]
    }
    localStorage.setItem('streamflix_user', JSON.stringify(user))
    onLogin(user)
  } else {
    setError('Invalid credentials')
  }
  
  setLoading(false)
}

return (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50"></div>
    
    <Card className="w-full max-w-md bg-black/80 border-gray-800 backdrop-blur-sm relative z-10">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img 
            src="/dozoom-logo.png" 
            alt="DoZOOM" 
            className="h-8 w-auto"
          />
        </div>
        <CardTitle className="text-white">Welcome to DoZOOM</CardTitle>
        <p className="text-gray-400">Sign in to your DoZOOM account</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
)
}
