"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export interface DashboardStatistics {
  // Core user statistics
  communitiesJoined: number;
  postsCreated: number;
  commentsPosted: number;
  likesReceived: number;
  likesGiven: number;
  activeDays: number;
  
  // Growth metrics (vs previous month)
  communitiesGrowth: number;
  postsGrowth: number;
  engagementGrowth: number;
  activityGrowth: number;
  
  // Additional insights
  joinDate: Date;
  favoriteHobbyName?: string;
  mostActiveHobbyName?: string;
  totalEngagement: number;
}

export interface UserActivityMetrics {
  currentMonth: {
    posts: number;
    comments: number;
    likes: number;
    communities: number;
    activeDays: number;
  };
  previousMonth: {
    posts: number;
    comments: number;
    likes: number;
    communities: number;
    activeDays: number;
  };
}

/**
 * Calculate percentage growth between two values
 */
function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Get date ranges for current and previous month
 */
function getDateRanges() {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  return {
    currentMonthStart,
    previousMonthStart,
    previousMonthEnd,
  };
}

/**
 * Get comprehensive dashboard statistics for the current user
 */
export async function getDashboardStatistics(): Promise<DashboardStatistics> {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { currentMonthStart, previousMonthStart, previousMonthEnd } = getDateRanges();

    // Get activity metrics for both current and previous month
    const activityMetrics = await getUserActivityMetrics(userId, {
      currentMonthStart,
      previousMonthStart,
      previousMonthEnd,
    });

    // Get all-time statistics
    const [
      communitiesJoined,
      postsCreated,
      commentsPosted,
      likesReceived,
      likesGiven,
      favoriteHobby,
      mostActiveHobby,
    ] = await Promise.all([
      // Communities joined
      db.member.count({
        where: { userId },
      }),

      // Posts created
      db.post.count({
        where: { authorId: userId },
      }),

      // Comments posted
      db.comment.count({
        where: { authorId: userId },
      }),

      // Likes received on user's posts
      db.like.count({
        where: {
          post: {
            authorId: userId,
          },
        },
      }),

      // Likes given by user
      db.like.count({
        where: { userId },
      }),

      // Most popular hobby by community count
      db.member.groupBy({
        by: ['communityId'],
        where: { userId },
        _count: {
          communityId: true,
        },
        orderBy: {
          _count: {
            communityId: 'desc',
          },
        },
        take: 1,
      }),

      // Most active hobby by post count
      db.post.groupBy({
        by: ['communityId'],
        where: { authorId: userId },
        _count: {
          communityId: true,
        },
        orderBy: {
          _count: {
            communityId: 'desc',
          },
        },
        take: 1,
      }),
    ]);

    // Get hobby names for favorite and most active
    let favoriteHobbyName: string | undefined;
    let mostActiveHobbyName: string | undefined;

    if (favoriteHobby.length > 0) {
      const community = await db.community.findUnique({
        where: { id: favoriteHobby[0].communityId },
        include: { hobby: true },
      });
      favoriteHobbyName = community?.hobby.name;
    }

    if (mostActiveHobby.length > 0) {
      const community = await db.community.findUnique({
        where: { id: mostActiveHobby[0].communityId },
        include: { hobby: true },
      });
      mostActiveHobbyName = community?.hobby.name;
    }

    // Calculate active days in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeDaysResult = await db.activity.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Count unique days
    const uniqueDays = new Set(
      activeDaysResult.map(activity => 
        activity.createdAt.toDateString()
      )
    );
    const activeDays = uniqueDays.size;

    // Calculate growth percentages
    const communitiesGrowth = calculateGrowth(
      activityMetrics.currentMonth.communities,
      activityMetrics.previousMonth.communities
    );

    const postsGrowth = calculateGrowth(
      activityMetrics.currentMonth.posts,
      activityMetrics.previousMonth.posts
    );

    const currentEngagement = activityMetrics.currentMonth.likes + activityMetrics.currentMonth.comments;
    const previousEngagement = activityMetrics.previousMonth.likes + activityMetrics.previousMonth.comments;
    const engagementGrowth = calculateGrowth(currentEngagement, previousEngagement);

    const activityGrowth = calculateGrowth(
      activityMetrics.currentMonth.activeDays,
      activityMetrics.previousMonth.activeDays
    );

    const totalEngagement = likesReceived + commentsPosted;

    return {
      communitiesJoined,
      postsCreated,
      commentsPosted,
      likesReceived,
      likesGiven,
      activeDays,
      communitiesGrowth,
      postsGrowth,
      engagementGrowth,
      activityGrowth,
      joinDate: user.createdAt,
      favoriteHobbyName,
      mostActiveHobbyName,
      totalEngagement,
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

/**
 * Get detailed activity metrics for current and previous month
 */
async function getUserActivityMetrics(
  userId: string,
  dateRanges: {
    currentMonthStart: Date;
    previousMonthStart: Date;
    previousMonthEnd: Date;
  }
): Promise<UserActivityMetrics> {
  const { currentMonthStart, previousMonthStart, previousMonthEnd } = dateRanges;

  // Current month metrics
  const [
    currentPosts,
    currentComments,
    currentLikes,
    currentCommunities,
    currentActivity,
  ] = await Promise.all([
    db.post.count({
      where: {
        authorId: userId,
        createdAt: { gte: currentMonthStart },
      },
    }),

    db.comment.count({
      where: {
        authorId: userId,
        createdAt: { gte: currentMonthStart },
      },
    }),

    db.like.count({
      where: {
        userId,
        createdAt: { gte: currentMonthStart },
      },
    }),

    db.member.count({
      where: {
        userId,
        createdAt: { gte: currentMonthStart },
      },
    }),

    db.activity.findMany({
      where: {
        userId,
        createdAt: { gte: currentMonthStart },
      },
      select: { createdAt: true },
    }),
  ]);

  // Previous month metrics
  const [
    previousPosts,
    previousComments,
    previousLikes,
    previousCommunities,
    previousActivity,
  ] = await Promise.all([
    db.post.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    }),

    db.comment.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    }),

    db.like.count({
      where: {
        userId,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    }),

    db.member.count({
      where: {
        userId,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    }),

    db.activity.findMany({
      where: {
        userId,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      select: { createdAt: true },
    }),
  ]);

  // Count unique active days
  const currentActiveDays = new Set(
    currentActivity.map(a => a.createdAt.toDateString())
  ).size;

  const previousActiveDays = new Set(
    previousActivity.map(a => a.createdAt.toDateString())
  ).size;

  return {
    currentMonth: {
      posts: currentPosts,
      comments: currentComments,
      likes: currentLikes,
      communities: currentCommunities,
      activeDays: currentActiveDays,
    },
    previousMonth: {
      posts: previousPosts,
      comments: previousComments,
      likes: previousLikes,
      communities: previousCommunities,
      activeDays: previousActiveDays,
    },
  };
}

/**
 * Get user engagement summary
 */
export async function getUserEngagementSummary() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentPosts, recentLikes, recentComments] = await Promise.all([
      db.post.findMany({
        where: {
          authorId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      db.like.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      db.comment.count({
        where: {
          authorId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    return {
      recentPosts,
      recentLikes,
      recentComments,
    };
  } catch (error) {
    console.error("Error fetching engagement summary:", error);
    throw new Error("Failed to fetch engagement summary");
  }
}