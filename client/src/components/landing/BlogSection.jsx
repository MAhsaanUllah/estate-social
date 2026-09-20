import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import api from '../../api/axios';

function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl overflow-hidden aspect-video mb-3.5 bg-gray-200 dark:bg-zinc-800" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
    </div>
  );
}

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.get('/posts?limit=3')
      .then(res => {
        if (!cancelled) setPosts(res.data.posts || []);
      })
      .catch(() => {
        // silently fail — no content shown
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Don't render section if no posts and done loading
  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-white dark:bg-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">Real Estate Insights</h2>
            <p className="text-[15px] text-gray-500 dark:text-zinc-400 mt-1">Latest news, market trends, and buying guides</p>
          </div>
          <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-zinc-100 hover:underline transition-colors">
            View All Posts <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-5">
          {loading
            ? [...Array(3)].map((_, i) => <BlogCardSkeleton key={i} />)
            : posts.map(post => (
              <Link key={post._id} to={`/blog/${post._id}`} className="group block">
                <div className="rounded-2xl overflow-hidden aspect-video mb-3.5 border border-gray-200/80 dark:border-zinc-800 relative bg-gray-100 dark:bg-zinc-800">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-opacity duration-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700" />
                  )}
                  {post.category && (
                    <div className="absolute top-3 left-3 bg-gray-900/85 dark:bg-zinc-100/90 backdrop-blur px-2.5 py-0.5 rounded-md text-xs font-medium text-white dark:text-zinc-900">
                      {post.category}
                    </div>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100 mb-1.5 group-hover:text-gray-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-2">{post.excerpt}</p>
                )}
                <div className="flex items-center text-gray-500 dark:text-zinc-400 text-xs font-medium">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {post.publishedAt ? formatDate(post.publishedAt) : 'Recent'}
                </div>
              </Link>
            ))
          }
        </div>

      </div>
    </section>
  );
}
