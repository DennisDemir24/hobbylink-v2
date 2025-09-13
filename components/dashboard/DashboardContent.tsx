import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart,
  Sparkles,
  Info
} from 'lucide-react'

import StatisticsCards from './StatisticsCard'
import { getDashboardStatistics } from '@/lib/actions/dashboard.action'
import { DashboardStatistics } from '@/lib/actions/dashboard.action'

interface User {
  id: string
  name: string | null
  email: string
  imageUrl: string | null
}

interface DashboardContentProps {
  user: User
}

function StatisticsCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {Array(4).fill(0).map((_, i) => (
        <Card key={i} className='animate-pulse'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1 space-y-3'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-3 w-32' />
              </div>
              <Skeleton className='h-12 w-12 rounded-xl' />
            </div>
            <div className='mt-4 flex items-center gap-1'>
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-3 w-20' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function InsightsSummary({ statistics }: { statistics: DashboardStatistics }) {
  const insights = []

  // Generate insights based on user data
  if (statistics.communitiesGrowth > 20) {
    insights.push({
      type: 'positive',
      emoji: '🚀',
      message: `Fantastic! You've joined ${statistics.communitiesGrowth}% more communities this month.`,
      icon: <TrendingUp className='h-4 w-4' />
    })
  }

  if (statistics.postsGrowth > 0 && statistics.engagementGrowth > 0) {
    insights.push({
      type: 'positive', 
      emoji: '💫',
      message: 'Your content is truly resonating - both posts and engagement are trending up!',
      icon: <Heart className='h-4 w-4' />
    })
  }

  if (statistics.activeDays > 20) {
    insights.push({
      type: 'positive',
      emoji: '🔥',
      message: 'You\'ve been incredibly active this month - your community engagement is inspiring!',
      icon: <Users className='h-4 w-4' />
    })
  }

  if (statistics.totalEngagement > 50) {
    insights.push({
      type: 'celebration',
      emoji: '🎉',
      message: `Outstanding! You've earned ${statistics.totalEngagement} total engagements on your content.`,
      icon: <MessageSquare className='h-4 w-4' />
    })
  }

  // Show encouragement for new users
  if (statistics.communitiesJoined < 3) {
    insights.push({
      type: 'info',
      emoji: '✨',
      message: 'Ready to explore? Join more communities to discover amazing hobbies and connect with passionate creators!',
      icon: <Info className='h-4 w-4' />
    })
  }

  return insights.length > 0 ? (
    <div className='mt-8'>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
          📊 Activity Insights
        </h3>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Personalized insights based on your recent activity
        </p>
      </div>
      
      <div className='grid gap-4'>
        {insights.slice(0, 3).map((insight, index) => (
          <div 
            key={index} 
            className={`group relative overflow-hidden rounded-xl p-4 border-0 transition-all duration-300 hover:shadow-lg ${
              insight.type === 'positive' 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10' 
                : insight.type === 'celebration'
                ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10'
            }`}
          >
            {/* Subtle animated background */}
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <div className={`absolute inset-0 ${
                insight.type === 'positive' 
                  ? 'bg-gradient-to-r from-emerald-100/50 to-teal-100/50 dark:from-emerald-800/20 dark:to-teal-800/20' 
                  : insight.type === 'celebration'
                  ? 'bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-800/20 dark:to-pink-800/20'
                  : 'bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-800/20 dark:to-indigo-800/20'
              }`} />
            </div>
            
            <div className='relative flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  insight.type === 'positive' 
                    ? 'bg-emerald-100 dark:bg-emerald-800/30' 
                    : insight.type === 'celebration'
                    ? 'bg-purple-100 dark:bg-purple-800/30'
                    : 'bg-blue-100 dark:bg-blue-800/30'
                }`}>
                  {(insight as { emoji: string }).emoji}
                </div>
              </div>
              
              <div className='flex-1 min-w-0'>
                <p className={`text-sm font-medium leading-relaxed ${
                  insight.type === 'positive' 
                    ? 'text-emerald-800 dark:text-emerald-300' 
                    : insight.type === 'celebration'
                    ? 'text-purple-800 dark:text-purple-300'
                    : 'text-blue-800 dark:text-blue-300'
                }`}>
                  {insight.message}
                </p>
              </div>
              
              <div className='flex-shrink-0 opacity-60'>
                <div className={`${
                  insight.type === 'positive' 
                    ? 'text-emerald-500 dark:text-emerald-400' 
                    : insight.type === 'celebration'
                    ? 'text-purple-500 dark:text-purple-400'
                    : 'text-blue-500 dark:text-blue-400'
                }`}>
                  {insight.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null
}

async function DashboardStatistics() {
  try {
    const statistics = await getDashboardStatistics()
    
    return (
      <div>
        <StatisticsCards statistics={statistics} />
        <InsightsSummary statistics={statistics} />
      </div>
    )
  } catch (error) {
    console.error('Error loading dashboard statistics:', error)
    
    return (
      <div>
        <StatisticsCardsSkeleton />
        <div className='mt-8 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-800/30'>
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0'>
              <div className='w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center text-xl'>
                ⚠️
              </div>
            </div>
            <div>
              <h3 className='text-sm font-medium text-amber-800 dark:text-amber-300 mb-1'>
                Statistics Temporarily Unavailable
              </h3>
              <p className='text-sm text-amber-700 dark:text-amber-400 leading-relaxed'>
We&apos;re having trouble loading your activity data. Please refresh the page or try again in a moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default function DashboardContent() {
  return (
    <div className='max-w-7xl mx-auto space-y-12'>
      {/* Statistics Section */}
      <section>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>📊</span>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
              Your Dashboard
            </h2>
          </div>
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl'>
            Track your engagement and growth across your hobby communities. See how your activity has evolved and discover new opportunities to connect.
          </p>
        </div>
        
        <Suspense fallback={<StatisticsCardsSkeleton />}>
          <DashboardStatistics />
        </Suspense>
      </section>

      {/* Future sections placeholder with modern design */}
      <section className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left column - will contain activity feed */}
        <div className='lg:col-span-2 space-y-8'>
          <div className='group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            
            <div className='relative p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center'>
                  <MessageSquare className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                  Recent Activity
                </h3>
              </div>
              
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-4'>
                  <span className='text-2xl'>🕰️</span>
                </div>
                <h4 className='text-lg font-medium text-gray-800 dark:text-gray-200 mb-2'>
                  Activity Feed Coming Soon
                </h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
                  Your personalized activity timeline will appear here, showing recent posts, comments, and community interactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - will contain recommendations and quick actions */}
        <div className='space-y-8'>
          <div className='group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300'>
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-teal-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            
            <div className='relative p-6'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center'>
                  <TrendingUp className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                  Quick Actions
                </h3>
              </div>
              
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center mb-3'>
                  <span className='text-xl'>⚡</span>
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
                  Contextual action buttons will be available here soon.
                </p>
              </div>
            </div>
          </div>

          <div className='group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-pink-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            
            <div className='relative p-6'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center'>
                  <Sparkles className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                  Recommendations
                </h3>
              </div>
              
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mb-3'>
                  <span className='text-xl'>🎯</span>
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
                  Personalized hobby and community recommendations based on your interests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
