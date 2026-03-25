// Blog Configuration
export const BLOG_CONFIG = {
  // Blogspot RSS feed URL - replace with actual Blogspot blog URL
  // Format: https://[blogname].blogspot.com/feeds/posts/default?alt=rss
  feedUrl: import.meta.env.VITE_BLOGSPOT_FEED_URL || 'https://sarojprakashbandi.blogspot.com/feeds/posts/default?alt=rss',
  
  // Enable/disable Blogspot feed fetching
  enableBlogspotFeed: import.meta.env.VITE_ENABLE_BLOGSPOT_FEED === 'true' || true,
  
  // Fallback to local blog data if feed fails
  useFallbackData: true,
  
  // Cache duration in minutes
  cacheDuration: 60,
};
