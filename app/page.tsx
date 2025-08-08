'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you might save the email or pass it to the login page
    router.push('/login')
  }

  const trendingContent = [
    { id: '1', title: 'Wednesday', image: '/wednesday-poster.png', rank: 1 },
    { id: '2', title: 'Squid Game', image: '/generic-survival-game-poster.png', rank: 2 },
    { id: '3', title: 'Raid 2', image: '/raid-2-movie-poster.png', rank: 3 },
    { id: '4', title: 'The Great Indian Kapil Show', image: '/indian-comedy-show-poster.png', rank: 4 },
    { id: '5', title: 'Mandu Murd', image: '/indian-drama-movie-poster.png', rank: 5 },
    { id: '6', title: 'Demon Slayer', image: '/demon-slayer-anime-poster.png', rank: 6 },
    { id: '7', title: 'One Piece', image: '/anime-poster.png', rank: 7 },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section 
        className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('/landing-background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center">
          <img 
            src="/dozoom-logo-cinematic.png" 
            alt="DoZOOM" 
            className="h-10 sm:h-12 w-auto"
          />
          <Button 
            onClick={() => router.push('/login')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
          >
            Sign In
          </Button>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 font-medium text-gray-200">
            Watch anywhere. Cancel anytime.
          </p>
          <p className="text-md sm:text-lg md:text-xl mb-6 text-gray-300">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
          <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-black/60 border border-gray-600 text-white placeholder-gray-400 px-5 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-semibold px-8 py-3 rounded-md flex items-center gap-2 transition-colors"
            >
              Get Started
              <ChevronRight className="w-6 h-6" />
            </Button>
          </form>
        </div>

        {/* Bottom Gradient Link */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 z-20"></div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-white">Trending Now</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {trendingContent.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-64 relative group cursor-pointer">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-5xl font-extrabold text-stroke-2 text-stroke-black">
                    {item.rank}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for other sections (e.g., FAQ, Footer) */}
      <section className="py-16 bg-gray-950 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p className="text-lg mb-4">Questions? Call 1-800-DOZOOM</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <a href="#" className="hover:underline">FAQ</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Account</a>
            <a href="#" className className="hover:underline">Media Center</a>
            <a href="#" className="hover:underline">Investor Relations</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Ways to Watch</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Cookie Preferences</a>
            <a href="#" className="hover:underline">Corporate Information</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
          <p className="mt-8">&copy; 2024 DoZOOM, Inc.</p>
        </div>
      </section>
    </div>
  )
}
