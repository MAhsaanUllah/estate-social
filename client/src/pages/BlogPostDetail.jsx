import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowLeft, MessageCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { BLOG_POSTS } from './BlogPage';
import api from '../api/axios';

export default function BlogPostDetail() {
  const { id } = useParams();
  const defaultPost = BLOG_POSTS.find((p) => p.id === Number(id)) || BLOG_POSTS[0];
  const [post, setPost] = useState(defaultPost);

  useEffect(() => {
    let cancelled = false;
    api.get(`/posts/${id}`)
      .then(res => {
        if (!cancelled && res.data.post) {
          setPost(res.data.post);
        }
      })
      .catch(() => {
        // Fall back to defaultPost
      });
    return () => { cancelled = true; };
  }, [id]);

  const postTitle = post.title || 'Blog Post';
  const postExcerpt = post.excerpt || '';
  const postImage = post.coverImage || post.image;
  const postCategory = post.category || 'Article';
  const postDate = post.publishedAt ? formatDate(post.publishedAt) : post.date || 'Recent';
  const postContent = post.content || postExcerpt;

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>{postTitle} | EstateSocial Blog</title>
        <meta name="description" content={postExcerpt} />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link to="/blog" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Insights & News
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-xs text-gray-400 dark:text-zinc-500">
            <span className="bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold px-2.5 py-0.5 rounded-md">{postCategory}</span>
            <span>•</span>
            <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" />{postDate}</span>
            {post.readTime && <span>•</span>}
            {post.readTime && <span>{post.readTime}</span>}
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50 leading-tight">
            {postTitle}
          </h1>
        </div>

        {/* Hero Image */}
        {postImage && (
          <div className="rounded-2xl overflow-hidden aspect-video border border-gray-200 dark:border-zinc-800">
            <img src={postImage} alt={postTitle} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-8 space-y-4 text-gray-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
          {postContent.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

      </div>
    </div>
  );
}

