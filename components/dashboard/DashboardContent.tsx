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
    <div className='mt-12'>
      <div className='text-center mb-8'>
        <div className='inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/30 dark:border-indigo-700/30'>
          <span className='text-lg'>📊</span>
          <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200'>
            Activity Insights
          </h3>
        </div>
        <p className='text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto'>
          Personalized insights based on your recent activity
        </p>
      </div>
      
      <div className='max-w-4xl mx-auto grid gap-6'>
        {insights.slice(0, 3).map((insight, index) => (
          <div 
            key={index} 
            className={`group relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
              insight.type === 'positive' 
                ? 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-700/30 hover:border-emerald-300 dark:hover:border-emerald-600' 
                : insight.type === 'celebration'
                ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 border-purple-200/50 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-700/30 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            {/* Enhanced animated background */}
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
              <div className={`absolute inset-0 ${
                insight.type === 'positive' 
                  ? 'bg-gradient-to-br from-emerald-100/60 via-green-100/40 to-teal-100/60 dark:from-emerald-800/30 dark:via-green-800/20 dark:to-teal-800/30' 
                  : insight.type === 'celebration'
                  ? 'bg-gradient-to-br from-purple-100/60 via-pink-100/40 to-rose-100/60 dark:from-purple-800/30 dark:via-pink-800/20 dark:to-rose-800/30'
                  : 'bg-gradient-to-br from-blue-100/60 via-indigo-100/40 to-cyan-100/60 dark:from-blue-800/30 dark:via-indigo-800/20 dark:to-cyan-800/30'
              }`} />
            </div>
            
            <div className='relative flex items-start gap-5'>
              <div className='flex-shrink-0'>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ${
                  insight.type === 'positive' 
                    ? 'bg-gradient-to-br from-emerald-200 via-green-200 to-teal-200 dark:bg-gradient-to-br dark:from-emerald-700/40 dark:via-green-700/40 dark:to-teal-700/40' 
                    : insight.type === 'celebration'
                    ? 'bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 dark:bg-gradient-to-br dark:from-purple-700/40 dark:via-pink-700/40 dark:to-rose-700/40'
                    : 'bg-gradient-to-br from-blue-200 via-indigo-200 to-cyan-200 dark:bg-gradient-to-br dark:from-blue-700/40 dark:via-indigo-700/40 dark:to-cyan-700/40'
                }`}>
                  {(insight as { emoji: string }).emoji}
                </div>
              </div>
              
              <div className='flex-1 min-w-0'>
                <p className={`text-base font-semibold leading-relaxed ${
                  insight.type === 'positive' 
                    ? 'text-emerald-900 dark:text-emerald-200' 
                    : insight.type === 'celebration'
                    ? 'text-purple-900 dark:text-purple-200'
                    : 'text-blue-900 dark:text-blue-200'
                }`}>
                  {insight.message}
                </p>
              </div>
              
              <div className='flex-shrink-0'>
                <div className={`p-2 rounded-full ${
                  insight.type === 'positive' 
                    ? 'bg-emerald-200/50 text-emerald-600 dark:bg-emerald-700/30 dark:text-emerald-400' 
                    : insight.type === 'celebration'
                    ? 'bg-purple-200/50 text-purple-600 dark:bg-purple-700/30 dark:text-purple-400'
                    : 'bg-blue-200/50 text-blue-600 dark:bg-blue-700/30 dark:text-blue-400'
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
    <div className='max-w-7xl mx-auto space-y-12 px-4'>
      {/* Statistics Section */}
      <section className='mb-12'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-700/30'>
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg'>
              <span className='text-white text-sm font-bold'>📊</span>
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent tracking-tight'>
              Your Dashboard
            </h1>
          </div>
          <p className='text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto font-medium'>
            Track your engagement and growth across your hobby communities. 
            <span className='block mt-1 text-gray-500 dark:text-gray-500'>See how your activity has evolved and discover new opportunities to connect.</span>
          </p>
        </div>
        
        <Suspense fallback={<StatisticsCardsSkeleton />}>
          <DashboardStatistics />
        </Suspense>
      </section>

      {/* Future sections placeholder with modern design */}
      <section className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16'>
        {/* Left column - will contain activity feed */}
        <div className='lg:col-span-2'>
          <div className='group relative overflow-hidden rounded-3xl border border-blue-200/50 dark:border-blue-700/30 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/20 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-purple-500/[0.03] to-pink-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
            
            <div className='relative p-10'>
              <div className='flex items-center gap-4 mb-8'>
                <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-700/40 dark:via-indigo-700/40 dark:to-purple-700/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500'>
                  <MessageSquare className='h-6 w-6 text-blue-700 dark:text-blue-300' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  Recent Activity
                </h3>
              </div>
              
              <div className='flex flex-col items-center justify-center py-16 text-center'>
                <div className='w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-700/40 dark:via-indigo-700/40 dark:to-purple-700/40 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500'>
                  <span className='text-3xl'>🕰️</span>
                </div>
                <h4 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-3'>
                  Activity Feed Coming Soon
                </h4>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg font-medium'>
                  Your personalized activity timeline will appear here, showing recent posts, comments, and community interactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - will contain recommendations and quick actions */}
        <div className='space-y-8'>
          <div className='group relative overflow-hidden rounded-3xl border border-emerald-200/50 dark:border-emerald-700/30 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/20 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2'>
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-teal-500/[0.03] to-green-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
            
            <div className='relative p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-200 via-teal-200 to-green-200 dark:from-emerald-700/40 dark:via-teal-700/40 dark:to-green-700/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500'>
                  <TrendingUp className='h-6 w-6 text-emerald-700 dark:text-emerald-300' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                  Quick Actions
                </h3>
              </div>
              
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-200 via-teal-200 to-green-200 dark:from-emerald-700/40 dark:via-teal-700/40 dark:to-green-700/40 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500'>
                  <span className='text-2xl'>⚡</span>
                </div>
                <h4 className='text-lg font-bold text-gray-800 dark:text-gray-200 mb-2'>
                  Actions Hub
                </h4>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                  Contextual action buttons will be available here soon.
                </p>
              </div>
            </div>
          </div>

          <div className='group relative overflow-hidden rounded-3xl border border-purple-200/50 dark:border-purple-700/30 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/20 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-pink-500/[0.03] to-rose-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
            
            <div className='relative p-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 dark:from-purple-700/40 dark:via-pink-700/40 dark:to-rose-700/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500'>
                  <Sparkles className='h-6 w-6 text-purple-700 dark:text-purple-300' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                  Recommendations
                </h3>
              </div>
              
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 dark:from-purple-700/40 dark:via-pink-700/40 dark:to-rose-700/40 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500'>
                  <span className='text-2xl'>🎯</span>
                </div>
                <h4 className='text-lg font-bold text-gray-800 dark:text-gray-200 mb-2'>
                  Smart Suggestions
                </h4>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
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
