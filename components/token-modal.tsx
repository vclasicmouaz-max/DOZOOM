'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Key, Download, Upload, History } from 'lucide-react'

interface Content {
  id: string
  title: string
  description: string
  image: string
  videoUrl: string
  type: 'movie' | 'series'
  episodes?: any[]
  seasons?: number
}

interface TokenModalProps {
  onClose: () => void
  onRestore: (token: string, content: Content[]) => void
  currentContent: Content[]
}

export default function TokenModal({ onClose, onRestore, currentContent }: TokenModalProps) {
  const [inputToken, setInputToken] = useState('')
  const [showBackup, setShowBackup] = useState(false)
  const [backupData, setBackupData] = useState<string>('')

  // Generate backup token and data
  const generateBackup = () => {
    const backupToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const backup = {
      token: backupToken,
      timestamp: new Date().toISOString(),
      content: currentContent,
      version: '1.0'
    }
    
    const backupString = JSON.stringify(backup, null, 2)
    setBackupData(backupString)
    setShowBackup(true)
    
    // Save to localStorage for future reference
    const existingBackups = JSON.parse(localStorage.getItem('streamflix_backups') || '[]')
    existingBackups.push(backup)
    localStorage.setItem('streamflix_backups', JSON.stringify(existingBackups.slice(-5))) // Keep last 5 backups
    
    return backupToken
  }

  const downloadBackup = () => {
    const blob = new Blob([backupData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `streamflix-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleTokenRestore = () => {
    try {
      // Try to parse as JSON backup first
      const parsed = JSON.parse(inputToken)
      if (parsed.token && parsed.content) {
        onRestore(parsed.token, parsed.content)
        return
      }
    } catch {
      // If not JSON, treat as simple token
    }

    // Check against stored backups
    const existingBackups = JSON.parse(localStorage.getItem('streamflix_backups') || '[]')
    const matchingBackup = existingBackups.find((backup: any) => backup.token === inputToken)
    
    if (matchingBackup) {
      onRestore(matchingBackup.token, matchingBackup.content)
    } else {
      alert('Invalid token or backup data')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const parsed = JSON.parse(content)
          if (parsed.token && parsed.content) {
            setInputToken(content)
          } else {
            alert('Invalid backup file format')
          }
        } catch {
          alert('Error reading backup file')
        }
      }
      reader.readAsText(file)
    }
  }

  const getStoredBackups = () => {
    return JSON.parse(localStorage.getItem('streamflix_backups') || '[]')
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            Content Backup & Restore
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
          {/* Create Backup Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Create Backup
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Generate a backup token and download your current content library
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={generateBackup}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate Backup
              </Button>
              
              {showBackup && (
                <Button
                  onClick={downloadBackup}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            {showBackup && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Backup Data (Copy this or download the file)
                </label>
                <textarea
                  value={backupData}
                  readOnly
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded text-white text-xs font-mono p-2"
                />
              </div>
            )}
          </div>

          {/* Restore Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Restore from Backup
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Enter a backup token or upload a backup file to restore your content
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Backup Token or JSON Data
                </label>
                <textarea
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  className="w-full h-24 bg-gray-700 border border-gray-600 rounded text-white p-2"
                  placeholder="Paste backup token or JSON data here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Or Upload Backup File
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full bg-gray-700 border border-gray-600 rounded text-white p-2 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700"
                />
              </div>
              
              <Button
                onClick={handleTokenRestore}
                disabled={!inputToken.trim()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Restore Content
              </Button>
            </div>
          </div>

          {/* Recent Backups */}
          {getStoredBackups().length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Backups
              </h3>
              <div className="space-y-2">
                {getStoredBackups().slice(-3).reverse().map((backup: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-2">
                    <div>
                      <div className="text-white text-sm">
                        {new Date(backup.timestamp).toLocaleDateString()} - {backup.content.length} items
                      </div>
                      <div className="text-gray-400 text-xs font-mono">
                        Token: {backup.token.substring(0, 16)}...
                      </div>
                    </div>
                    <Button
                      onClick={() => onRestore(backup.token, backup.content)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Content Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Current Content Library</h3>
            <div className="text-gray-400 text-sm">
              <p>Total Items: {currentContent.length}</p>
              <p>Movies: {currentContent.filter(item => item.type === 'movie').length}</p>
              <p>Series: {currentContent.filter(item => item.type === 'series').length}</p>
              <p>Total Episodes: {currentContent.reduce((acc, item) => acc + (item.episodes?.length || 0), 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
