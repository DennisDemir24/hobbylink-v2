import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import DashboardHeader from "@/components/dashboard/DashboarHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";

function DashboardSkeleton() {
  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* Header skeleton */}
      <div className='flex items-center gap-4 mb-8'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-48' />
        </div>
      </div>

      {/* Statistics cards skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className='h-32' />
          ))}
      </div>

      {/* Main content skeleton */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Skeleton className='h-64' />
          <Skeleton className='h-48' />
        </div>
        <div className='space-y-6'>
          <Skeleton className='h-64' />
          <Skeleton className='h-48' />
        </div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  // Ensure user exists in database and get user data
  const user = await checkUser();
  
  
  if (!user) {
    // If no user is found, redirect to sign-in
    redirect("/sign-in");
  }
  
  return (
    <div className='container mx-auto py-6 space-y-6'>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardHeader user={user} />
        <DashboardContent />
      </Suspense>
    </div>
  )
}