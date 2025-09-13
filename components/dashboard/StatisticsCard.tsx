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
    <Card className={`group relative overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:border-blue-300/50 dark:hover:border-blue-600/50 ${className || ''}`}>
      {/* Enhanced gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-purple-500/[0.02] to-pink-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      
      <CardContent className='relative p-7'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-4'>
              <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide uppercase'>
                {title}
              </h3>
              {badge && (
                <Badge 
                  variant={badge.variant || 'secondary'} 
                  className='text-xs px-3 py-1 font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-0 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 rounded-full'
                >
                  {badge.label}
                </Badge>
              )}
            </div>
            
            <div className='mb-3'>
              <span className='text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight leading-none'>
                {value.toLocaleString()}
              </span>
            </div>
            
            {subtitle && (
              <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                {subtitle}
              </p>
            )}
          </div>
          
          <div className='relative ml-4'>
            <div className='h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-800/30 dark:via-indigo-800/30 dark:to-purple-800/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-blue-500/20'>
              <div className='text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300'>
                {icon}
              </div>
            </div>
            {/* Enhanced glow effect */}
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300/40 via-indigo-300/30 to-purple-300/40 dark:from-blue-400/20 dark:via-indigo-400/15 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md' />
          </div>
        </div>
        
        {trend && trend.value !== 0 && (
          <div className='flex items-center justify-between pt-4 border-t border-gray-200/80 dark:border-gray-700/80'>
            <div className='flex items-center gap-2'>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold shadow-sm ${
                trend.isPositive 
                  ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200/50 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300 dark:border-emerald-700/50' 
                  : 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border border-rose-200/50 dark:from-rose-900/30 dark:to-red-900/30 dark:text-rose-300 dark:border-rose-700/50'
              }`}>
                <TrendIcon className='h-4 w-4' />
                <span>
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              </div>
            </div>
            
            <span className='text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide'>
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
