'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Plus, LogOut, Trash2, Search, Filter, X, RefreshCw, Key, Copy, Check, Star, Clock, Users } from 'lucide-react'
import AddContentModal from './add-content-modal'
import VideoPlayer from './video-player'
import AddEpisodeModal from './add-episode-modal'
import TokenModal from './token-modal'
import UpdateTokenModal from './update-token-modal'
import SeriesDetailPage from './series-detail-page'

interface Episode {
  id: string
  title: string
  videoUrl: string
  episodeNumber: number
  seasonNumber: number
}

interface Content {
  id: string
  title: string
  description: string
  image: string
  videoUrl: string
  type: 'movie' | 'series'
  episodes?: Episode[]
  seasons?: number
  genre?: string
  year?: number
  rating?: number
}

interface HomePageProps {
  user: any
  onLogout: () => void
}

export default function HomePage({ user, onLogout }: HomePageProps) {
  const [content, setContent] = useState<Content[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEpisodeModal, setShowEpisodeModal] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [showUpdateTokenModal, setShowUpdateTokenModal] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [selectedSeries, setSelectedSeries] = useState<Content | null>(null)
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'title' | 'newest' | 'oldest'>('title')
  const [updateToken, setUpdateToken] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSeriesDetail, setShowSeriesDetail] = useState<Content | null>(null)
  const [copiedToken, setCopiedToken] = useState(false)
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [showDailyContentModal, setShowDailyContentModal] = useState(false)
  const [comingSoonContent, setComingSoonContent] = useState<Content[]>([])
  const [dailyContent, setDailyContent] = useState<Content | null>(null)

  useEffect(() => {
    const savedContent = localStorage.getItem('streamflix_content')
    const savedToken = localStorage.getItem('streamflix_update_token')
    const savedComingSoon = localStorage.getItem('streamflix_coming_soon')
    const savedDailyContent = localStorage.getItem('streamflix_daily_content')
    
    if (savedContent) {
      setContent(JSON.parse(savedContent))
    } else {
      // Add default content with Devil May Cry
      const defaultContent: Content[] = [
        {
          id: '1',
          title: 'Demon Slayer: Kimetsu no Yaiba - The Movie: Infinity Castle',
          description: 'The epic continuation of the Demon Slayer saga with breathtaking animation and intense battles against the most powerful demons.',
          image: '/infinity-castle-poster.png',
          videoUrl: 'https://moviebox.ph/movies/demon-slayer-kimetsu-no-yaiba-the-movie-infinity-castle-cam-MallNh9VXH4?id=3952375510730261496&scene=&type=/movie/detail&utm_source=h5seo_www.google.com',
          type: 'movie',
          genre: 'Action, Animation, Adventure',
          year: 2024,
          rating: 8.9
        },
        {
          id: '2',
          title: 'Devil May Cry',
          description: 'Based on the legendary video game series, follow Dante as he battles demons in this action-packed DoZOOM original series.',
          image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rmj1WJ97GSx7AtYRfiNqpLl9RYfwOs.png',
          videoUrl: 'https://youtu.be/OlEqHXRrcpc',
          type: 'series',
          genre: 'Action, Supernatural, Adventure',
          year: 2024,
          rating: 9.1,
          seasons: 1,
          episodes: [
            { id: '2-1', title: 'Devil Hunter', videoUrl: 'https://youtu.be/OlEqHXRrcpc', episodeNumber: 1, seasonNumber: 1 },
            { id: '2-2', title: 'Stylish Action', videoUrl: 'https://youtu.be/OlEqHXRrcpc', episodeNumber: 2, seasonNumber: 1 }
          ]
        }
      ]
      setContent(defaultContent)
      localStorage.setItem('streamflix_content', JSON.stringify(defaultContent))
    }

    if (savedComingSoon) {
      setComingSoonContent(JSON.parse(savedComingSoon))
    }

    if (savedDailyContent) {
      setDailyContent(JSON.parse(savedDailyContent))
    } else {
      // Set Devil May Cry as default daily content
      const defaultDaily = {
        id: 'daily-1',
        title: 'Devil May Cry',
        description: 'A DoZOOM Original Series. The legendary demon hunter Dante faces his greatest challenge yet in this stylish action series.',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rmj1WJ97GSx7AtYRfiNqpLl9RYfwOs.png',
        videoUrl: 'https://youtu.be/OlEqHXRrcpc',
        type: 'series' as const,
        genre: 'Action, Supernatural, Adventure',
        year: 2024,
        rating: 9.1
      }
      setDailyContent(defaultDaily)
      localStorage.setItem('streamflix_daily_content', JSON.stringify(defaultDaily))
    }

    if (savedToken) {
      setUpdateToken(savedToken)
    }
  }, [])

  const filteredAndSortedContent = content
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === 'all' || item.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.year || 0) - (a.year || 0)
        case 'oldest':
          return (a.year || 0) - (b.year || 0)
        case 'title':
        default:
          return a.title.localeCompare(b.title)
      }
    })

  const handleAddContent = (newContent: Omit<Content, 'id'>) => {
    const contentWithId = {
      ...newContent,
      id: Date.now().toString()
    }
    const updatedContent = [...content, contentWithId]
    setContent(updatedContent)
    localStorage.setItem('streamflix_content', JSON.stringify(updatedContent))
    setShowAddModal(false)
  }

  const handleDeleteContent = (id: string) => {
    const updatedContent = content.filter(item => item.id !== id)
    setContent(updatedContent)
    localStorage.setItem('streamflix_content', JSON.stringify(updatedContent))
  }

  const handleAddEpisode = (seriesId: string, episode: Omit<Episode, 'id'>) => {
    const updatedContent = content.map(item => {
      if (item.id === seriesId) {
        const episodes = item.episodes || []
        const newEpisode = {
          ...episode,
          id: Date.now().toString()
        }
        const updatedEpisodes = [...episodes, newEpisode]
        const maxSeason = Math.max(...updatedEpisodes.map(ep => ep.seasonNumber), 0)
        
        return {
          ...item,
          episodes: updatedEpisodes,
          seasons: maxSeason
        }
      }
      return item
    })
    setContent(updatedContent)
    localStorage.setItem('streamflix_content', JSON.stringify(updatedContent))
    setShowEpisodeModal(false)
  }

  const generateUpdateToken = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setUpdateToken(token)
    localStorage.setItem('streamflix_update_token', token)
    return token
  }

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    } catch (err) {
      console.error('Failed to copy token:', err)
    }
  }

  const handleWebsiteUpdate = async (token: string) => {
    setIsUpdating(true)
    
    // Simulate update process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Clear all content during update
    setContent([])
    localStorage.removeItem('streamflix_content')
    
    // Clear the used token
    setUpdateToken(null)
    localStorage.removeItem('streamflix_update_token')
    
    setIsUpdating(false)
    setShowUpdateTokenModal(false)
    
    // Show success message
    alert('Website updated successfully! All content has been cleared.')
  }

  const handleTokenRestore = (token: string, backupContent: Content[]) => {
    setContent(backupContent)
    localStorage.setItem('streamflix_content', JSON.stringify(backupContent))
    setShowTokenModal(false)
    alert('Content restored successfully from backup!')
  }

  const handleLogout = () => {
    localStorage.removeItem('streamflix_user')
    onLogout()
  }

  const handlePlayContent = (videoUrl: string, title: string) => {
    setPlayingVideo({ url: videoUrl, title })
  }

  const handleSeriesClick = (series: Content) => {
    if (series.type === 'series') {
      setShowSeriesDetail(series)
    } else {
      handlePlayContent(series.videoUrl, series.title)
    }
  }

  const handleAddComingSoon = (newContent: Omit<Content, 'id'>) => {
    const contentWithId = {
      ...newContent,
      id: Date.now().toString(),
      comingSoon: true
    }
    const updatedComingSoon = [...comingSoonContent, contentWithId]
    setComingSoonContent(updatedComingSoon)
    localStorage.setItem('streamflix_coming_soon', JSON.stringify(updatedComingSoon))
    setShowComingSoonModal(false)
  }

  const handleAddDailyContent = (newContent: Omit<Content, 'id'>) => {
    const contentWithId = {
      ...newContent,
      id: Date.now().toString()
    }
    setDailyContent(contentWithId)
    localStorage.setItem('streamflix_daily_content', JSON.stringify(contentWithId))
    setShowDailyContentModal(false)
  }

  if (playingVideo) {
    return (
      <VideoPlayer
        url={playingVideo.url}
        title={playingVideo.title}
        onClose={() => setPlayingVideo(null)}
      />
    )
  }

  if (showSeriesDetail) {
    return (
      <SeriesDetailPage
        series={showSeriesDetail}
        onClose={() => setShowSeriesDetail(null)}
        onPlay={handlePlayContent}
        user={user}
        onAddEpisode={user.isOwner ? (episode) => handleAddEpisode(showSeriesDetail.id, episode) : undefined}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/dozoom-logo.png" 
                alt="DoZOOM" 
                className="h-8 w-auto"
              />
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-white hover:text-red-400 transition-colors font-medium">Home</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Movies</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Series</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">My List</a>
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 hidden sm:block">Welcome, {user.name}</span>
              
              {user.isOwner && (
                <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
                  <Button
                    onClick={() => setShowDailyContentModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg"
                    title="Set Daily Hero Banner"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Daily Banner</span>
                    <span className="sm:hidden">Daily</span>
                  </Button>
                  
                  <Button
                    onClick={() => setShowComingSoonModal(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg"
                    title="Add Secret Coming Soon Content"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Coming Soon</span>
                    <span className="sm:hidden">Secret</span>
                  </Button>
                  
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
                    title="Add Regular Content"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Add Content</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              )}
              
              {user.isOwner && (
                <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
                  <Button
                    onClick={() => setShowTokenModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Backup</span>
                  </Button>
                  
                  <Button
                    onClick={() => setShowUpdateTokenModal(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 transition-all duration-200"
                    disabled={isUpdating}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{isUpdating ? 'Updating...' : 'Update'}</span>
                  </Button>
                </div>
              )}
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Update Token Display */}
      {user.isOwner && updateToken && (
        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-b border-yellow-700/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Update Token:</span>
                <code className="bg-black/50 px-3 py-1.5 rounded-lg text-yellow-200 font-mono text-sm border border-yellow-700/30">
                  {updateToken}
                </code>
              </div>
              <Button
                onClick={() => copyToken(updateToken)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 transition-all duration-200"
              >
                {copiedToken ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: dailyContent ? `url(${dailyContent.image})` : `url('/demon-slayer-infinity-castle-dark-cinematic.png')`
          }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <img 
                src="/dozoom-logo.png" 
                alt="DoZOOM" 
                className="h-6 w-auto"
              />
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {dailyContent ? `${dailyContent.type === 'series' ? 'DoZOOM Series' : 'DoZOOM Original'}` : 'Featured Content'}
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              {dailyContent ? dailyContent.title : 'Unlimited Entertainment'}
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in-delay max-w-2xl leading-relaxed">
              {dailyContent ? dailyContent.description : 'Stream the latest movies and series in stunning quality. Discover thousands of titles across all genres.'}
            </p>
            <div className="flex gap-4 animate-fade-in-delay-2">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                onClick={() => {
                  if (dailyContent) {
                    handlePlayContent(dailyContent.videoUrl, dailyContent.title)
                  } else {
                    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <Play className="w-6 h-6 mr-3 fill-white" />
                {dailyContent ? 'Watch Trailer' : 'Start Watching'}
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      {comingSoonContent.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
            <span className="text-gray-400">Secret releases</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonContent.map((item) => (
              <div
                key={item.id}
                className="group relative bg-gray-900/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-gray-800/50 hover:border-red-500/50 shadow-lg hover:shadow-2xl"
              >
                <div className="aspect-video relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm bg-orange-600/90 text-white">
                      Coming Soon
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies, series, and genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-700/50 filter-slide-in shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Content Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Content' },
                    { value: 'movie', label: 'Movies' },
                    { value: 'series', label: 'Series' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="contentType"
                        value={option.value}
                        checked={filterType === option.value}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'movie' | 'series')}
                        className="mr-3 text-red-600 focus:ring-red-600"
                      />
                      <span className="text-gray-300 hover:text-white transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'title' | 'newest' | 'oldest')}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-200"
                >
                  <option value="title">Title (A-Z)</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Results</label>
                <div className="bg-gray-800 rounded-lg px-3 py-2 text-gray-300 border border-gray-600">
                  {filteredAndSortedContent.length} item{filteredAndSortedContent.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setFilterType('all')
                  setSortBy('title')
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Content Grid Section */}
      <section id="content-section" className="container mx-auto px-4 pb-12">
        {(searchQuery || filterType !== 'all') && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : `${filterType === 'movie' ? 'Movies' : 'Series'}`}
            </h2>
            <p className="text-gray-400 text-lg">
              {filteredAndSortedContent.length} result{filteredAndSortedContent.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {filteredAndSortedContent.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-900/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-gray-800/50 hover:border-red-500/50 shadow-lg hover:shadow-2xl"
              onClick={() => handleSeriesClick(item)}
            >
              <div className="aspect-[2/3] relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Content Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${
                    item.type === 'movie' 
                      ? 'bg-blue-600/90 text-white' 
                      : 'bg-green-600/90 text-white'
                  }`}>
                    {item.type === 'movie' ? 'Movie' : 'Series'}
                  </span>
                </div>
                
                {/* Rating */}
                {item.rating && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-medium">{item.rating}</span>
                    </div>
                  </div>
                )}
                
                {/* Season Count for Series */}
                {item.type === 'series' && item.seasons && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-600/90 text-white backdrop-blur-sm">
                      {item.seasons} Season{item.seasons !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-300">
                      {item.year && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.year}
                        </span>
                      )}
                      {item.genre && (
                        <span className="text-gray-400">{item.genre.split(',')[0]}</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{item.description}</p>
                    
                    {/* Series Info */}
                    {item.type === 'series' && item.episodes && (
                      <div className="mb-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {item.episodes.length} Episodes
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.type === 'series') {
                            setShowSeriesDetail(item)
                          } else {
                            handlePlayContent(item.videoUrl, item.title)
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 flex-1 rounded-lg transition-all duration-200"
                      >
                        <Play className="w-4 h-4 mr-2 fill-white" />
                        {item.type === 'series' ? 'View' : 'Play'}
                      </Button>
                      
                      {item.type === 'series' && user.isOwner && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSeries(item)
                            setShowEpisodeModal(true)
                          }}
                          className="bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {user.isOwner && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteContent(item.id)
                          }}
                          variant="destructive"
                          size="sm"
                          className="rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* No Results */}
        {filteredAndSortedContent.length === 0 && content.length > 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <Search className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">No results found</h3>
              <p className="text-gray-400 text-lg mb-8">
                {searchQuery 
                  ? `No content matches "${searchQuery}"`
                  : `No ${filterType}s available`
                }
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery('')
                setFilterType('all')
                setSortBy('title')
              }}
              className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl transition-all duration-200"
            >
              Clear Search & Filters
            </Button>
          </div>
        )}
        
        {/* Empty State */}
        {content.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-3">No content available yet</h3>
            <p className="text-gray-400 text-lg mb-8">Start building your content library</p>
            {user.isOwner && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Content
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Modals */}
      {showAddModal && (
        <AddContentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddContent}
        />
      )}
      
      {showEpisodeModal && selectedSeries && (
        <AddEpisodeModal
          series={selectedSeries}
          onClose={() => setShowEpisodeModal(false)}
          onAdd={(episode) => handleAddEpisode(selectedSeries.id, episode)}
        />
      )}

      {showTokenModal && (
        <TokenModal
          onClose={() => setShowTokenModal(false)}
          onRestore={handleTokenRestore}
          currentContent={content}
        />
      )}

      {showUpdateTokenModal && (
        <UpdateTokenModal
          onClose={() => setShowUpdateTokenModal(false)}
          onUpdate={handleWebsiteUpdate}
          onGenerateToken={generateUpdateToken}
          currentToken={updateToken}
          isUpdating={isUpdating}
        />
      )}

      {showComingSoonModal && (
        <AddContentModal
          onClose={() => setShowComingSoonModal(false)}
          onAdd={handleAddComingSoon}
          title="Add Coming Soon Content"
          subtitle="Add secret series or movies with trailers"
        />
      )}

      {showDailyContentModal && (
        <AddContentModal
          onClose={() => setShowDailyContentModal(false)}
          onAdd={handleAddDailyContent}
          title="Add Daily Featured Content"
          subtitle="Set the hero banner content for today"
        />
      )}
    </div>
  )
}
