type CardProps = {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-[#e0ebe9] bg-white p-6 ${
        hover ? 'transition-all duration-200 hover:border-[#2d6a5e]/30 hover:bg-[#faf8f5]' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
