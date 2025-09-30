"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

// Generate consistent color based on name hash
function getAvatarColor(name: string): string {
  const colors = [
    "bg-forest-500", // forest green
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-violet-500"
  ]

  // Simple hash function for consistent color per name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

// Get initials from name
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + (words[1]?.[0] || "")).toUpperCase()
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base"
}

export default function UserAvatar({
  name,
  size = "md",
  className
}: UserAvatarProps) {
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback
        className={cn(
          colorClass,
          "text-white font-semibold"
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}