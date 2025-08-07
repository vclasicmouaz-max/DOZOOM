'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, X, Calendar, Star, Clock } from 'lucide-react'

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClose: () => void
}

interface SearchFilters {
  query: string
  type: 'all' | 'movie' | 'series'
  sortBy: 'title' | 'newest' | 'oldest' | 'episodes'
  hasEpisodes?: boolean
}

export default function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | 'movie' | 'series'>('all')
  const [sortBy, setSortBy] = useState<'title' | 'newest' | 'oldest' | 'episodes'>('title')
  const [hasEpisodes, setHasEpisodes] = useState(false)

  const handleSearch = () => {
    onSearch({
      query,
      type,
      sortBy,
      hasEpisodes: type === 'series' ? hasEpisodes : undefined
    })
    onClose()
  }

  const handleReset = () => {
    setQuery('')
    setType('all')
    setSortBy('title')
    setHasEpisodes(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Advanced Search & Filters
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
          {/* Search Query */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Terms
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white pl-10"
                placeholder="Search titles, descriptions..."
              />
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'all', label: 'All', icon: Filter },
                { value: 'movie', label: 'Movies', icon: Calendar },
                { value: 'series', label: 'Series', icon: Clock }
              ].map((option) => {
                const Icon = option.icon
                return (
                  <Button
                    key={option.value}
                    onClick={() => setType(option.value as any)}
                    className={`flex items-center gap-2 ${
                      type === option.value 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort Results By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="title">Title (A-Z)</option>
              <option value="newest">Newest Added</option>
              <option value="oldest">Oldest Added</option>
              {type === 'series' && (
                <option value="episodes">Episode Count</option>
              )}
            </select>
          </div>

          {/* Series-specific filters */}
          {type === 'series' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Series Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasEpisodes}
                    onChange={(e) => setHasEpisodes(e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-gray-300">Only series with episodes</span>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Reset
            </Button>
            <Button
              onClick={handleSearch}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
