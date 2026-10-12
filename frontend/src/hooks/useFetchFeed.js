import { useState, useEffect, useCallback } from 'react';
import { getPosts, createPost as apiCreatePost, upvotePost as apiUpvotePost, deletePost as apiDeletePost } from '../utils/api';

const FALLBACK_POSTS = [
  {
    _id: '1',
    id: '1',
    author: 'alex_dev',
    title: 'Is this custom React hook causing memory leaks or unnecessary re-renders in useEffect?',
    createdAt: new Date().toISOString(),
    language: 'javascript',
    tags: ['react', 'performance'],
    code: `const useFetchData = (url) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let isMounted = true;
    fetch(url)
      .then(res => res.json())
      .then(result => { if (isMounted) setData(result); });
    return () => { isMounted = false; };
  }, [url]);
  return data;
};`,
    upvotes: 42,
    comments: [
      {
        author: 'sarah_backend',
        text: 'Consider using AbortController to cancel network requests in flight.',
        line: 5,
        diff: 'const controller = new AbortController();\nfetch(url, { signal: controller.signal });',
        isAccepted: true,
      },
    ],
  },
  {
    _id: '2',
    id: '2',
    author: 'sarah_backend',
    title: 'Review my MongoDB aggregation pipeline for dynamic category filtering',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    language: 'javascript',
    tags: ['mongodb', 'express'],
    code: `await db.collection('posts').aggregate([
  { $match: { status: "open" } },
  { $group: { _id: "$tags", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
]);`,
    upvotes: 27,
    comments: [],
  },
  {
    _id: '3',
    id: '3',
    author: 'michael_sec',
    title: 'Is this JWT bearer token validation logic susceptible to timing attacks?',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    language: 'javascript',
    tags: ['security', 'express'],
    code: `const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};`,
    upvotes: 65,
    comments: [],
  },
];

export function useFetchFeed(initialSort = 'hot') {
  const [posts, setPosts] = useState([]);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from backend API (EXP NO. 4: Read All)
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(FALLBACK_POSTS);
      }
    } catch (err) {
      console.warn('Backend not responding to GET /api/posts, using fallback snippets:', err.message);
      setPosts(FALLBACK_POSTS);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Sort posts based on active tab
  const sortedPosts = [...posts].sort((a, b) => {
    if (activeSort === 'hot') {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    if (activeSort === 'latest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (activeSort === 'needs-review') {
      return (a.comments?.length || 0) - (b.comments?.length || 0);
    }
    return 0;
  });

  // Create Post (EXP NO. 4: Create)
  const addPost = async (newPostData) => {
    try {
      const created = await apiCreatePost(newPostData);
      setPosts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      // Offline fallback
      const localPost = {
        _id: String(Date.now()),
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        upvotes: 0,
        comments: [],
        ...newPostData,
      };
      setPosts((prev) => [localPost, ...prev]);
      return localPost;
    }
  };

  // Upvote Post (EXP NO. 4: Update)
  const upvotePost = async (id, delta = 1) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) =>
        (p._id === id || p.id === id)
          ? { ...p, upvotes: Math.max(0, (p.upvotes || 0) + delta) }
          : p
      )
    );
    try {
      await apiUpvotePost(id, delta);
    } catch (err) {
      console.warn('Upvote API error:', err.message);
    }
  };

  // Delete Post (EXP NO. 4 & 6: Protected Delete)
  const deletePost = async (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
    try {
      await apiDeletePost(id);
    } catch (err) {
      console.error('Delete post error:', err.message);
      throw err;
    }
  };

  return {
    posts: sortedPosts,
    loading,
    error,
    activeSort,
    setActiveSort,
    refreshPosts: loadPosts,
    addPost,
    upvotePost,
    deletePost,
  };
}
