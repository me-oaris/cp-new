import { User } from 'lucide-react'

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const baseClasses = 'rounded-full bg-gray-600 flex items-center justify-center overflow-hidden'
  const classes = `${baseClasses} ${sizes[size]} ${className}`
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classes}
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
    )
  }
  
  return (
    <div className={classes}>
      <User className="w-1/2 h-1/2 text-gray-400" />
    </div>
  )
}

export default Avatar
