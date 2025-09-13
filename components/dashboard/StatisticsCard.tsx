import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  FileText,
  Heart,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { DashboardStatistics } from '@/lib/actions/dashboard.action'

interface StatisticsCardsProps {
  statistics: DashboardStatistics
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  subtitle?: string
  badge?: {
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  className?: string
}

function StatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  badge,
  className,
}: StatCardProps) {
  const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown
  
  return (
    <Card className={`group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className || ''}`}>
      {/* Subtle gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      
      <CardContent className='relative p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-3'>
              <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide'>
                {title}
              </h3>
              {badge && (
                <Badge 
                  variant={badge.variant || 'secondary'} 
                  className='text-xs px-2.5 py-0.5 font-normal bg-gray-100 text-gray-600 border-0 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  {badge.label}
                </Badge>
              )}
            </div>
            
            <div className='mb-2'>
              <span className='text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
                {value.toLocaleString()}
              </span>
            </div>
            
            {subtitle && (
              <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                {subtitle}
              </p>
            )}
          </div>
          
          <div className='relative'>
            <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <div className='text-blue-600 dark:text-blue-400'>
                {icon}
              </div>
            </div>
            {/* Subtle glow effect */}
            <div className='absolute inset-0 rounded-2xl bg-blue-200/20 dark:bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm' />
          </div>
        </div>
        
        {trend && trend.value !== 0 && (
          <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800'>
            <div className='flex items-center gap-2'>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                trend.isPositive 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
              }`}>
                <TrendIcon className='h-3.5 w-3.5' />
                <span>
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              </div>
            </div>
            
            <span className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
              {trend.label || 'vs last month'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const memberSince = new Date(statistics.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })

  // Calculate engagement rate
  const engagementRate = statistics.postsCreated > 0 
    ? Math.round((statistics.totalEngagement / statistics.postsCreated) * 100) / 100
    : 0

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <StatCard
        title='Communities'
        value={statistics.communitiesJoined}
        icon={<Users className='h-6 w-6' />}
        subtitle={`Member since ${memberSince}`}
        trend={{
          value: statistics.communitiesGrowth,
          isPositive: statistics.communitiesGrowth >= 0,
        }}
        badge={statistics.favoriteHobbyName ? {
          label: statistics.favoriteHobbyName,
        } : undefined}
      />

      <StatCard
        title='Posts Created'
        value={statistics.postsCreated}
        icon={<FileText className='h-6 w-6' />}
        subtitle='Total contributions'
        trend={{
          value: statistics.postsGrowth,
          isPositive: statistics.postsGrowth >= 0,
        }}
        badge={statistics.mostActiveHobbyName ? {
          label: statistics.mostActiveHobbyName,
        } : undefined}
      />

      <StatCard
        title='Engagement'
        value={statistics.totalEngagement}
        icon={<Heart className='h-6 w-6' />}
        subtitle={`${engagementRate} avg per post`}
        trend={{
          value: statistics.engagementGrowth,
          isPositive: statistics.engagementGrowth >= 0,
        }}
        badge={{
          label: `❤️ ${statistics.likesReceived}`,
        }}
      />

      <StatCard
        title='Activity Score'
        value={statistics.activeDays}
        icon={<Calendar className='h-6 w-6' />}
        subtitle='Active days (last 30)'
        trend={{
          value: statistics.activityGrowth,
          isPositive: statistics.activityGrowth >= 0,
        }}
        badge={{
          label: statistics.activeDays > 15 ? '🔥 Very Active' : statistics.activeDays > 5 ? '✨ Active' : '🌱 Getting Started',
        }}
      />
    </div>
  )
}
