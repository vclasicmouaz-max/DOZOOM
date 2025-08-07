'use client'

import { useState, useEffect } from 'react'
import { Search, Clock, TrendingUp } from 'lucide-react'

interface Content {
  id: string
  title: string
  type: 'movie' | 'series'
}

interface SearchSuggestionsProps {
  content: Content[]
  searchQuery: string
  onSuggestionClick: (suggestion: string) => void
  onClose: () => void
}

export default function SearchSuggestions({ 
  content, 
  searchQuery, 
  onSuggestionClick, 
  onClose 
}: SearchSuggestionsProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Content[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('streamflix_recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = content
        .filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchQuery, content])

  const handleSuggestionClick = (suggestion: string) => {
    // Add to recent searches
    const updated = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('streamflix_recent_searches', JSON.stringify(updated))
    
    onSuggestionClick(suggestion)
    onClose()
  }

  const popularSearches = ['Action Movies', 'Anime Series', 'Comedy', 'Drama', 'Thriller']

  if (searchQuery.length === 0 && recentSearches.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-b-lg shadow-xl z-10 max-h-96 overflow-y-auto">
      {/* Content Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-2">
          <div className="text-xs text-gray-400 px-2 py-1 font-medium">SUGGESTIONS</div>
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSuggestionClick(item.title)}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-white text-sm">{item.title}</div>
                <div className="text-gray-400 text-xs capitalize">{item.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {searchQuery.length === 0 && recentSearches.length > 0 && (
        <div className="p-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 px-2 py-1 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            RECENT SEARCHES
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center gap-3"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-white text-sm">{search}</span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {searchQuery.length === 0 && (
        <div className="p-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 px-2 py-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            POPULAR SEARCHES
          </div>
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded flex items-center gap-3"
            >
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-white text-sm">{search}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
