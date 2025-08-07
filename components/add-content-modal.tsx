'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Film, Tv } from 'lucide-react'

interface AddContentModalProps {
  onClose: () => void
  onAdd: (content: {
    title: string
    description: string
    image: string
    videoUrl: string
    type: 'movie' | 'series'
  }) => void
  title?: string
  subtitle?: string
}

export default function AddContentModal({ onClose, onAdd, title, subtitle }: AddContentModalProps) {
  const [contentTitle, setContentTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [type, setType] = useState<'movie' | 'series'>('movie')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contentTitle && description && image && videoUrl) {
      onAdd({
        title: contentTitle,
        description,
        image,
        videoUrl,
        type
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            {type === 'movie' ? <Film className="w-5 h-5" /> : <Tv className="w-5 h-5" />}
            {title || `Add New ${type === 'movie' ? 'Movie' : 'Series'}`}
          </CardTitle>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
          )}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                onClick={() => setType('movie')}
                className={`flex-1 ${type === 'movie' ? 'bg-red-600' : 'bg-gray-700'}`}
              >
                <Film className="w-4 h-4 mr-2" />
                Movie
              </Button>
              <Button
                type="button"
                onClick={() => setType('series')}
                className={`flex-1 ${type === 'series' ? 'bg-red-600' : 'bg-gray-700'}`}
              >
                <Tv className="w-4 h-4 mr-2" />
                Series
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <Input
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter description"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter image URL (1080x1527 recommended)"
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
                Add {type === 'movie' ? 'Movie' : 'Series'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
