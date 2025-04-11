
import { useState, useEffect, useRef } from 'react'
import { SendHorizontal, TrashIcon } from 'lucide-react'
import { cn } from './lib/utils'

type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

// Predefined responses for demo
const responses = [
  "Hello! How can I help you today?",
  "That's interesting! Tell me more.",
  "I understand. Let me help you with that.",
  "Thanks for sharing! Is there anything specific you'd like to know?",
  "I appreciate your question. Here's what I think...",
]

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-messages')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: Date.now()
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      role: 'assistant',
      timestamp: Date.now() + 1
    }

    setMessages(prev => [...prev, userMessage, aiMessage])
    setInput('')
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">AI Chat</h1>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Clear chat"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-4 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-300",
                message.role === 'user' 
                  ? 'bg-blue-600 ml-auto max-w-[80%]' 
                  : 'bg-gray-800 mr-auto max-w-[80%]'
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendHorizontal className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App