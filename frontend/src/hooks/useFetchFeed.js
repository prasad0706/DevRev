import { useState, useEffect } from 'react';

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'alex_dev',
    title: 'Is this custom React hook causing memory leaks or unnecessary re-renders in useEffect?',
    time: '12m ago',
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
    commentsCount: 8,
    viewers: 6,
    status: 'open',
  },
  {
    id: 2,
    author: 'sarah_backend',
    title: 'Review my MongoDB aggregation pipeline for dynamic category filtering',
    time: '45m ago',
    language: 'javascript',
    tags: ['mongodb', 'express'],
    code: `await db.collection('posts').aggregate([
  { $match: { status: "open" } },
  { $group: { _id: "$tags", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
]);`,
    upvotes: 27,
    commentsCount: 3,
    viewers: 2,
    status: 'open',
  },
  {
    id: 3,
    author: 'michael_sec',
    title: 'Is this JWT bearer token validation logic susceptible to timing attacks?',
    time: '2h ago',
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
    commentsCount: 14,
    viewers: 11,
    status: 'resolved',
  },
];

export function useFetchFeed(initialSort = 'hot') {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPosts((prevPosts) => {
        const sorted = [...prevPosts];
        if (activeSort === 'hot') {
          return sorted.sort((a, b) => b.upvotes - a.upvotes);
        } else if (activeSort === 'latest') {
          return sorted.sort((a, b) => b.id - a.id);
        } else if (activeSort === 'needs-review') {
          return sorted.sort((a, b) => (a.status === 'open' ? -1 : 1));
        }
        return sorted;
      });
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeSort]);

  const addPost = (newPost) => {
    const postObj = {
      id: Date.now(),
      author: newPost.author || 'prasad_m',
      title: newPost.title,
      time: 'Just now',
      language: newPost.language || 'javascript',
      tags: newPost.tags || ['code-review'],
      code: newPost.code,
      upvotes: 1,
      commentsCount: 0,
      viewers: 1,
      status: 'open',
    };
    setPosts((prev) => [postObj, ...prev]);
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const upvotePost = (id, delta) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + delta } : p))
    );
  };

  return {
    posts,
    loading,
    activeSort,
    setActiveSort,
    addPost,
    deletePost,
    upvotePost,
  };
}
