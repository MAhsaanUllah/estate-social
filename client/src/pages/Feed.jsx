import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings, setPage, clearFilters } from '../redux/listingSlice';
import FilterBar from '../components/FilterBar';
import FeedCard from '../components/FeedCard';
import { PropertyCardSkeleton } from '../components/Skeletons';
import { Home, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function Feed() {
  const dispatch = useDispatch();
  const {
    listings = [],
    loading = false,
    filters = {},
    pagination = { page: 1, limit: 12, total: 0, totalPages: 0 }
  } = useSelector((state) => state.listings || {});

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 12;
  const total = pagination?.total || listings.length;
  const totalPages = pagination?.totalPages || 1;
  const filtersString = JSON.stringify(filters);

  useEffect(() => {
    dispatch(fetchListings({ ...filters, page, limit }));
  }, [dispatch, filtersString, page, limit]);

  const displayListings = listings;

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-zinc-950 pb-16 transition-colors duration-200">
      <Helmet>
        <title>EstateSocial | Property Marketplace</title>
        <meta name="description" content="Discover verified properties for sale and rent in Pakistan. Find your dream home, plot, or commercial space." />
      </Helmet>

      {/* Header Section */}
      <section className="bg-white dark:bg-zinc-900 border-b border-gray-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">Property Marketplace</h1>
              <p className="text-[15px] text-gray-500 dark:text-zinc-400 mt-1">Discover verified properties in your society</p>
            </div>
            {total > 0 && (
              <span className="text-sm font-medium text-gray-500 dark:text-zinc-400 text-right">
                {total} {total === 1 ? 'property' : 'properties'}
              </span>
            )}
          </div>

          <FilterBar />
        </div>
      </section>

      {/* Listings Grid Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && listings.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : displayListings.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-12 text-center my-8">
              <Home className="h-12 w-12 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100 mb-1">No properties found</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Try adjusting your filters or search criteria</p>
              <button
                type="button"
                onClick={() => dispatch(clearFilters())}
                className="inline-flex items-center justify-center space-x-2 text-sm font-semibold text-gray-900 dark:text-zinc-100 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 px-4 py-2 rounded-xl transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Clear all filters</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayListings.map((listing, index) => (
                  <FeedCard key={listing?._id || index} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center space-x-3">
                  <button
                    type="button"
                    onClick={() => dispatch(setPage(page - 1))}
                    disabled={page === 1}
                    className="h-9 w-9 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(setPage(page + 1))}
                    disabled={page === totalPages}
                    className="h-9 w-9 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Feed;