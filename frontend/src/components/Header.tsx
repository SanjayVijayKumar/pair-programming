'use client'

import React from 'react'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Pair Programming',
  subtitle,
}) => {
  return (
    <header className="h-16 bg-editor-bg border-b border-editor-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-editor-fg">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition"
        >
          GitHub
        </a>
        <a
          href="https://fastapi.tiangolo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition"
        >
          Docs
        </a>
      </div>
    </header>
  )
}
