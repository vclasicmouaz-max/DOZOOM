import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DoZOOM - Stream Movies & Series Online',
  description: 'DoZOOM offers a vast library of movies and series for online streaming. Discover your next favorite show or movie.',
  keywords: 'dozoom, movies, tv shows, streaming, watch online, entertainment',
  authors: [{ name: 'DoZOOM' }],
  creator: 'DoZOOM',
  publisher: 'DoZOOM',
  robots: 'index, follow',
  openGraph: {
    title: 'DoZOOM - Stream Movies & Series Online',
    description: 'DoZOOM offers a vast library of movies and series for online streaming. Discover your next favorite show or movie.',
    url: 'https://dozoom.com',
    siteName: 'DoZOOM',
    images: [
      {
        url: '/dozooom.png',
        width: 1200,
        height: 630,
        alt: 'DoZOOM Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoZOOM - Stream Movies & Series Online',
    description: 'DoZOOM offers a vast library of movies and series for online streaming. Discover your next favorite show or movie.',
    images: ['/dozooom.png'],
    creator: '@dozoom',
  },
  icons: {
    icon: [
      { url: '/dozooom.png', sizes: 'any', type: 'image/png' },
    ],
  },
  manifest: '/dozooom.png',
  themeColor: '#1a0033',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#1a0033" />
        <meta name="msapplication-TileColor" content="#1a0033" />
        <meta name="msapplication-config" content="/dozoom-browserconfig.xml" />
        
        {/* DoZOOM Brand Colors */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --dozoom-purple: #1a0033;
            }
          `
        }} />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://youtu.be" />
        <link rel="preconnect" href="https://youtube.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Structured Data for DoZOOM */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "DoZOOM",
              "alternateName": "DoZOOM Streaming Platform",
              "url": "https://dozoom.com",
              "description": "DoZOOM offers a vast library of movies and series for online streaming. Discover your next favorite show or movie.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://dozoom.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://www.facebook.com/dozoom",
                "https://twitter.com/dozoom",
                "https://www.instagram.com/dozoom",
                "https://www.youtube.com/channel/DoZOOM"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>

        {/* Main App */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Global Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent right-click context menu (DoZOOM-like behavior)
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
              });

              // Disable text selection on images and videos
              document.addEventListener('selectstart', function(e) {
                if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
                  e.preventDefault();
                }
              });

              // Keyboard shortcuts
              document.addEventListener('keydown', function(e) {
                // Disable F12, Ctrl+Shift+I, Ctrl+U (DoZOOM-like protection)
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')) {
                  e.preventDefault();
                  return false;
                }
                
                // Space bar to play/pause (when video is playing)
                if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                  const video = document.querySelector('video');
                  if (video) {
                    e.preventDefault();
                    if (video.paused) {
                      video.play();
                    } else {
                      video.pause();
                    }
                  }
                }
                
                // Escape key to close modals/video player
                if (e.key === 'Escape') {
                  const closeButtons = document.querySelectorAll('[aria-label="Close"], .modal-close, .video-close');
                  if (closeButtons.length > 0) {
                    closeButtons[closeButtons.length - 1].click();
                  }
                }
              });

              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                    }
                  }, 0);
                });
              }

              // Service Worker registration for PWA capabilities
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />

        {/* Analytics placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // DoZOOM-style analytics tracking
              (function() {
                const analytics = {
                  track: function(event, data) {
                    console.log('Analytics:', event, data);
                    // In production, this would send to your analytics service
                  },
                  
                  trackPageView: function(page) {
                    this.track('page_view', { page: page, timestamp: Date.now() });
                  },
                  
                  trackVideoPlay: function(title, duration) {
                    this.track('video_play', { title: title, duration: duration, timestamp: Date.now() });
                  },
                  
                  trackVideoComplete: function(title, watchTime) {
                    this.track('video_complete', { title: title, watchTime: watchTime, timestamp: Date.now() });
                  }
                };
                
                window.DoZOOMAnalytics = analytics;
                
                // Track initial page load
                analytics.trackPageView(window.location.pathname);
              })();
            `
          }}
        />
      </body>
    </html>
  )
}
