'use client'

import { Button } from '@/components/ui/button'
import { X, ArrowLeft } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title: string
  onClose: () => void
}

export default function VideoPlayer({ url, title, onClose }: VideoPlayerProps) {
  // Extract video ID or embed URL for different platforms
  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    
    // For other URLs, try to embed directly
    return url
  }

  const embedUrl = getEmbedUrl(url)

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-white text-lg font-semibold">{title}</h1>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center">
        {url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            <div className="max-w-4xl w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src={url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
            <p className="mt-4 text-gray-400 text-center max-w-2xl">
              If the video doesn't load, the URL might not support embedding. 
              Try using YouTube, Vimeo, or other supported platforms.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
