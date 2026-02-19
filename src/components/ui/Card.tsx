type CardProps = {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-800 bg-zinc-900 p-6 ${
        hover ? 'transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/50' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
