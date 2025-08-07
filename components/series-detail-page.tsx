'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Plus, Star, Clock, Users, Calendar, Share, Heart, Download } from 'lucide-react'

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

interface SeriesDetailPageProps {
  series: Content
  onClose: () => void
  onPlay: (url: string, title: string) => void
  user: any
  onAddEpisode?: (episode: Omit<Episode, 'id'>) => void
}

export default function SeriesDetailPage({ series, onClose, onPlay, user, onAddEpisode }: SeriesDetailPageProps) {
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [activeTab, setActiveTab] = useState<'episodes' | 'details' | 'reviews'>('episodes')

  const getAvailableSeasons = () => {
    if (!series.episodes) return [1]
    const seasons = [...new Set(series.episodes.map(ep => ep.seasonNumber))].sort((a, b) => a - b)
    return seasons.length > 0 ? seasons : [1]
  }

  const getSeasonEpisodes = (seasonNumber: number) => {
    return series.episodes?.filter(ep => ep.seasonNumber === seasonNumber).sort((a, b) => a.episodeNumber - b.episodeNumber) || []
  }

  const availableSeasons = getAvailableSeasons()
  const currentSeasonEpisodes = getSeasonEpisodes(selectedSeason)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <img 
              src="/dozoom-logo.png" 
              alt="DoZOOM" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${series.image})`
          }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-end pb-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Series
              </span>
              {series.rating && (
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-medium">{series.rating}</span>
                  <span className="text-gray-400">/10</span>
                </div>
              )}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              {series.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-6 text-gray-300">
              {series.year && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {series.year}
                </span>
              )}
              {series.seasons && (
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {series.seasons} Season{series.seasons !== 1 ? 's' : ''}
                </span>
              )}
              {series.episodes && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {series.episodes.length} Episodes
                </span>
              )}
            </div>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
              {series.description}
            </p>
            
            {series.genre && (
              <div className="flex flex-wrap gap-2 mb-8">
                {series.genre.split(',').map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-gray-300"
                  >
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex gap-4">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                onClick={() => {
                  if (currentSeasonEpisodes.length > 0) {
                    onPlay(currentSeasonEpisodes[0].videoUrl, `${series.title} - S${selectedSeason}E${currentSeasonEpisodes[0].episodeNumber}`)
                  } else {
                    onPlay(series.videoUrl, series.title)
                  }
                }}
              >
                <Play className="w-6 h-6 mr-3 fill-white" />
                Play
              </Button>
              
              <Button 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <Heart className="w-5 h-5 mr-2" />
                My List
              </Button>
              
              <Button 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-6 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-8 mb-8 border-b border-gray-800">
          {[
            { id: 'episodes', label: 'Episodes', icon: Play },
            { id: 'details', label: 'Details & Cast', icon: Users },
            { id: 'reviews', label: 'Reviews', icon: Star }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 px-2 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'text-white border-b-2 border-red-600' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Episodes Tab */}
        {activeTab === 'episodes' && (
          <div>
            {/* Season Selector */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Episodes</h2>
              <div className="flex gap-2">
                {availableSeasons.map(season => (
                  <Button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`${
                      selectedSeason === season 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    } rounded-lg transition-all duration-200`}
                  >
                    Season {season}
                  </Button>
                ))}
              </div>
              
              {user.isOwner && onAddEpisode && (
                <Button
                  onClick={() => {/* This would open add episode modal */}}
                  className="bg-blue-600 hover:bg-blue-700 ml-auto rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Episode
                </Button>
              )}
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
              {currentSeasonEpisodes.length > 0 ? (
                currentSeasonEpisodes.map((episode, index) => (
                  <div
                    key={episode.id}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-red-500/50 transition-all duration-200 cursor-pointer group"
                    onClick={() => onPlay(episode.videoUrl, `${series.title} - S${episode.seasonNumber}E${episode.episodeNumber}: ${episode.title}`)}
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-4xl font-bold text-gray-600 group-hover:text-red-500 transition-colors duration-200">
                        {episode.episodeNumber.toString().padStart(2, '0')}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors duration-200">
                          {episode.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Season {episode.seasonNumber}, Episode {episode.episodeNumber}
                        </p>
                      </div>
                      
                      <Button
                        className="bg-red-600 hover:bg-red-700 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          onPlay(episode.videoUrl, `${series.title} - S${episode.seasonNumber}E${episode.episodeNumber}: ${episode.title}`)
                        }}
                      >
                        <Play className="w-5 h-5 fill-white" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No episodes available</h3>
                  <p className="text-gray-400">Episodes for Season {selectedSeason} will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Series Information</h2>
              <div className="space-y-4">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50">
                  <h3 className="font-semibold text-gray-300 mb-2">Genre</h3>
                  <p className="text-white">{series.genre || 'Not specified'}</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50">
                  <h3 className="font-semibold text-gray-300 mb-2">Release Year</h3>
                  <p className="text-white">{series.year || 'Not specified'}</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50">
                  <h3 className="font-semibold text-gray-300 mb-2">Rating</h3>
                  <p className="text-white">{series.rating ? `${series.rating}/10` : 'Not rated'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Synopsis</h2>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <p className="text-gray-300 leading-relaxed">{series.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
              <p className="text-gray-400">Be the first to review this series!</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
