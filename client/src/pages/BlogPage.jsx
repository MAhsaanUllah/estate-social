import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import api from '../api/axios';

export const BLOG_POSTS = [
  {
    id: 1,
    title: 'Real Estate Tax Changes in 2026: What Buyers Need to Know',
    category: 'Market Updates',
    date: 'Oct 24, 2026',
    readTime: '5 min read',
    excerpt: 'Understanding FBR tax rate revisions, advance tax on property transactions, and gain tax exemptions for 2026.',
    content: `Pakistani real estate taxation has undergone significant updates. Property buyers and sellers must navigate updated FBR valuation tables, advance withholding tax rates for filers vs non-filers, and Capital Gains Tax (CGT) holding period rules.

### Key Highlights for 2026:
1. **FBR Valuation Table Revisions**: Property values in major urban areas (DHA, Bahria Town, CDA) have been updated closer to actual market value.
2. **Withholding Tax Differences**: Filers pay reduced advance tax (approx 3%), whereas non-filers face higher rates (up to 12%).
3. **Holding Period Exemptions**: CGT rates taper off for open plots and constructed properties over 3-6 years of ownership.

Always consult a certified tax practitioner before executing high-value property transfers.`,
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Top 5 Emerging Societies in Lahore for High ROI in 2026',
    category: 'Investment',
    date: 'Oct 22, 2026',
    readTime: '7 min read',
    excerpt: 'An in-depth analysis of high-yield residential and commercial projects around Ring Road and Raiwind Road.',
    content: `Lahore’s real estate market continues to expand towards the South and East along Ring Road interchanges. For investors seeking strong capital appreciation and rental yield, these top societies offer verified NOCs and fast-paced development.

### Top Recommended Areas:
- **DHA Phase 9 Prism & Phase 10**: High liquidity and infrastructure expansion.
- **Lake City Phase 2**: Ideal for constructed villas and quiet family living.
- **Soul City & New Lahore City**: Affordable 5 Marla plots with easy installment plans.
- **Etihad Town Phase 2**: Commercial hub along Main Raiwind Road.

Investing early during initial possession handovers typically yields 18-25% annual capital gains.`,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'A Step-by-Step Guide to Securing the Best Home Loan Rates in Pakistan',
    category: 'Guides',
    date: 'Oct 18, 2026',
    readTime: '6 min read',
    excerpt: 'Compare Islamic Diminishing Musharakah vs Conventional Mortgage schemes across top Pakistani commercial banks.',
    content: `Securing home financing in Pakistan requires evaluating bank profit rates, processing turnaround, and down payment requirements.

### Key Bank Options:
- **State Bank of Pakistan Subsidized Schemes**: Offers low fixed rates for 3 Marla to 10 Marla housing.
- **Meezan Bank Easy Home**: 100% Shariah-compliant joint ownership model.
- **HBL & Bank Alfalah**: Flexible plot purchase + construction financing options.

Ensure your debt-to-income ratio (DTI) does not exceed 40% of net monthly verifiable income for swift approval.`,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop'
  }
];

export default function BlogPage() {
  const [posts, setPosts] = useState(BLOG_POSTS);

  useEffect(() => {
    let cancelled = false;
    api.get('/posts')
      .then(res => {
        if (!cancelled && res.data.posts && res.data.posts.length > 0) {
          setPosts(res.data.posts);
        }
      })
      .catch(() => {
        // Fall back to default BLOG_POSTS
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>Real Estate News & Guides | EstateSocial</title>
        <meta name="description" content="Read real estate market updates, tax guides, investment tips, and home loan insights in Pakistan." />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3 rounded-2xl shadow-sm mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
            Real Estate Insights & News
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400">
            Market analysis, tax updates, investment strategies, and Pakistani housing guides.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const postId = post._id || post.id;
            const postImg = post.coverImage || post.image;
            const postDate = post.publishedAt ? formatDate(post.publishedAt) : post.date || 'Recent';

            return (
              <div key={postId} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <img 
                      src={postImg} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {post.category && (
                      <span className="absolute top-3 left-3 bg-gray-900/85 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center text-xs text-gray-400 dark:text-zinc-500 space-x-3">
                      <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" />{postDate}</span>
                      {post.readTime && <span>•</span>}
                      {post.readTime && <span>{post.readTime}</span>}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-50 group-hover:text-gray-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link to={`/blog/${postId}`} className="inline-flex items-center text-xs font-semibold text-gray-900 dark:text-zinc-100 hover:underline">
                    Read Full Article <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

