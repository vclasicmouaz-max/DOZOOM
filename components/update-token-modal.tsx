'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, RefreshCw, Key, AlertTriangle, Copy, Check } from 'lucide-react'

interface UpdateTokenModalProps {
  onClose: () => void
  onUpdate: (token: string) => void
  onGenerateToken: () => string
  currentToken: string | null
  isUpdating: boolean
}

export default function UpdateTokenModal({ 
  onClose, 
  onUpdate, 
  onGenerateToken, 
  currentToken, 
  isUpdating 
}: UpdateTokenModalProps) {
  const [inputToken, setInputToken] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState(false)

  const handleGenerateToken = () => {
    const token = onGenerateToken()
    setGeneratedToken(token)
  }

  const handleUpdate = () => {
    if (inputToken === currentToken || inputToken === generatedToken) {
      onUpdate(inputToken)
    } else {
      alert('Invalid token. Please use the generated token.')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    } catch (err) {
      console.error('Failed to copy token:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700/50">
          <CardTitle className="text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Website Update System
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isUpdating}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Warning */}
          <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-medium mb-1">⚠️ Critical Operation</h3>
                <p className="text-red-300 text-sm">
                  This will permanently delete all content. Create a backup first!
                </p>
              </div>
            </div>
          </div>

          {/* Current Token Display */}
          {currentToken && (
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-green-400" />
                Active Update Token
              </h3>
              <div className="flex items-center gap-2">
                <code className="bg-black/50 px-3 py-2 rounded-lg text-green-400 font-mono text-sm flex-1 border border-green-500/30">
                  {currentToken}
                </code>
                <Button
                  onClick={() => copyToClipboard(currentToken)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 transition-all duration-200"
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
              <p className="text-gray-400 text-xs mt-2">
                ✅ Token ready for website update
              </p>
            </div>
          )}

          {/* Generate New Token */}
          {!currentToken && (
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-700/50">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-yellow-400" />
                Generate Update Token
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Create a secure token to enable website updates
              </p>
              
              <Button
                onClick={handleGenerateToken}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transition-all duration-200"
                disabled={isUpdating}
              >
                <Key className="w-4 h-4 mr-2" />
                Generate Secure Token
              </Button>

              {generatedToken && (
                <div className="mt-4 p-3 bg-black/30 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="bg-black/50 px-3 py-2 rounded text-green-400 font-mono text-sm flex-1">
                      {generatedToken}
                    </code>
                    <Button
                      onClick={() => copyToClipboard(generatedToken)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 transition-all duration-200"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-green-400 text-xs">
                    ✅ Token generated! Copy and save it securely.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Update Section */}
          {(currentToken || generatedToken) && (
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                Execute Website Update
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Paste the update token to proceed with the update
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Update Token
                  </label>
                  <Input
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    className="bg-black/50 border-gray-600 text-white rounded-lg transition-all duration-200 focus:border-red-500"
                    placeholder="Paste your update token here..."
                    disabled={isUpdating}
                  />
                </div>

                {!showConfirm ? (
                  <Button
                    onClick={() => setShowConfirm(true)}
                    disabled={!inputToken.trim() || isUpdating}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50"
                  >
                    Proceed to Update
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
                      <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Final confirmation required
                      </p>
                      <p className="text-red-300 text-xs mt-1">
                        This action cannot be undone. All content will be permanently deleted.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowConfirm(false)}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200"
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Confirm Update'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Update Process */}
          {isUpdating && (
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                <div>
                  <h3 className="text-blue-400 font-medium">Update in Progress</h3>
                  <p className="text-blue-300 text-sm">
                    Please wait while the website is being updated...
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-black/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
