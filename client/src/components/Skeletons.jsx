import React from 'react';

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 dark:bg-zinc-800 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-200 dark:bg-zinc-800 rounded-3xl w-full" />
            <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4/5" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 space-y-6">
              <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-full mx-auto" />
              <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/2 mx-auto" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mx-auto" />
              <div className="h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-800 rounded-xl shrink-0" />
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-48" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-32" />
            </div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-24" />
        </div>
      ))}
    </div>
  );
}
