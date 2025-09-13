import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Bell } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string | null
  email: string
  imageUrl: string | null
}

interface DashboardHeaderProps {
  user: User
  unreadCount?: number
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardHeader({
  user,
  unreadCount = 0,
}: DashboardHeaderProps) {
  const displayName =
    user.name && user.name !== 'null null'
      ? user.name
      : user.email.split('@')[0]

  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-12 w-12'>
          <AvatarImage src={user.imageUrl || ''} alt={displayName} />
          <AvatarFallback>
            {displayName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-3xl font-bold'>
            {getGreeting()}, {displayName}!
          </h1>
          <p className='text-muted-foreground'>
            Welcome back to your hobby community hub
          </p>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <Button variant='outline' asChild>
          <Link href='/discover'>
            <Search className='h-4 w-4 mr-2' />
            Discover
          </Link>
        </Button>

        <Button asChild>
          <Link href='/community'>
            <Plus className='h-4 w-4 mr-2' />
            Create Post
          </Link>
        </Button>

        <Button variant='outline' size='icon' className='relative'>
          <Bell className='h-4 w-4' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs'
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  )
}
