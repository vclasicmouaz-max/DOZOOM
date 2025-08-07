'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Play } from 'lucide-react'

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
  episodes?: Episode[]
  seasons?: number
}

interface AddEpisodeModalProps {
  series: Content
  onClose: () => void
  onAdd: (episode: {
    title: string
    videoUrl: string
    episodeNumber: number
    seasonNumber: number
  }) => void
}

export default function AddEpisodeModal({ series, onClose, onAdd }: AddEpisodeModalProps) {
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [newSeason, setNewSeason] = useState(false)
  const [newSeasonNumber, setNewSeasonNumber] = useState(1)

  // Get existing seasons
  const existingSeasons = series.episodes 
    ? [...new Set(series.episodes.map(ep => ep.seasonNumber))].sort((a, b) => a - b)
    : []

  // Get next episode number for selected season
  const getNextEpisodeNumber = (seasonNum: number) => {
    if (!series.episodes) return 1
    const seasonEpisodes = series.episodes.filter(ep => ep.seasonNumber === seasonNum)
    return seasonEpisodes.length > 0 ? Math.max(...seasonEpisodes.map(ep => ep.episodeNumber)) + 1 : 1
  }

  const currentSeasonNumber = newSeason ? newSeasonNumber : selectedSeason
  const nextEpisodeNumber = getNextEpisodeNumber(currentSeasonNumber)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && videoUrl) {
      onAdd({
        title,
        videoUrl,
        episodeNumber: nextEpisodeNumber,
        seasonNumber: currentSeasonNumber
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Episode to {series.title}
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Season Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Season</label>
            <div className="space-y-3">
              {/* Existing Seasons */}
              {existingSeasons.length > 0 && (
                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="seasonType"
                      checked={!newSeason}
                      onChange={() => setNewSeason(false)}
                      className="mr-2 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-gray-300">Add to existing season</span>
                  </label>
                  
                  {!newSeason && (
                    <div className="ml-6 grid grid-cols-4 gap-2">
                      {existingSeasons.map(season => (
                        <Button
                          key={season}
                          type="button"
                          onClick={() => setSelectedSeason(season)}
                          className={`${
                            selectedSeason === season 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          Season {season}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* New Season */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="seasonType"
                    checked={newSeason}
                    onChange={() => setNewSeason(true)}
                    className="mr-2 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-gray-300">Create new season</span>
                </label>
                
                {newSeason && (
                  <div className="ml-6">
                    <Input
                      type="number"
                      min="1"
                      value={newSeasonNumber}
                      onChange={(e) => setNewSeasonNumber(parseInt(e.target.value) || 1)}
                      className="bg-gray-800 border-gray-600 text-white w-32"
                      placeholder="Season number"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Episode Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-4 h-4 text-red-500" />
              <span className="text-white font-medium">
                Season {currentSeasonNumber}, Episode {nextEpisodeNumber}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              This will be added as the next episode in the selected season
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Episode Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter episode title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Video URL</label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter video URL from any website"
                required
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Add Episode
              </Button>
            </div>
          </form>

          {/* Existing Episodes Preview */}
          {series.episodes && series.episodes.length > 0 && (
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-white font-medium mb-3">Existing Episodes</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {series.episodes
                  .sort((a, b) => a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber)
                  .map((episode) => (
                    <div key={episode.id} className="flex items-center justify-between bg-gray-800 rounded p-2">
                      <div>
                        <span className="text-white text-sm">
                          S{episode.seasonNumber}E{episode.episodeNumber}: {episode.title}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
