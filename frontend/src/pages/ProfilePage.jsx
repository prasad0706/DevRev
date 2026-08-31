import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import UpvoteButton from '../components/UpvoteButton';
import CodeViewer from '../components/CodeViewer';
import { MessageSquare } from 'lucide-react';

export default function ProfilePage({ username = 'alex_dev', onNavigate }) {
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(`[useEffect - Dependency] Loading profile data for @${username}`);
  }, [username]);

  const isSelf = user.username === username;

  const profile = {
    username: username,
    name: isSelf ? user.name : username === 'alex_dev' ? 'Alex Rivera' : 'Sarah Chen',
    role: isSelf ? user.role : username === 'alex_dev' ? 'Verified Reviewer' : 'Moderator',
    karma: isSelf ? user.karma : username === 'alex_dev' ? 620 : 850,
    acceptedCount: isSelf ? user.acceptedRefactors : username === 'alex_dev' ? 15 : 24,
    joined: 'Aug 2026',
    bio: isSelf
      ? 'Full Stack Developer & React internals enthusiast.'
      : 'Specialized in Node.js backend performance & security auditing.',
  };

  const userPosts = [
    {
      id: 1,
      author: username,
      title: 'Is this custom React hook causing memory leaks or unnecessary re-renders in useEffect?',
      time: '12m ago',
      language: 'javascript',
      tags: ['react', 'performance'],
      code: `const useFetchData = (url) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let isMounted = true;
    fetch(url).then(res => res.json()).then(result => {
      if (isMounted) setData(result);
    });
    return () => { isMounted = false; };
  }, [url]);
  return data;
};`,
      upvotes: 42,
      commentsCount: 8,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="hidden md:block md:col-span-3">
        <LeftSidebar activeTab="home" onSelectTab={() => onNavigate('home')} />
      </div>

      <main className="col-span-1 md:col-span-6 space-y-4">
        <div className="bg-[#151517] border border-[#242427] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1C1C1F] border border-[#4F9CF9] flex items-center justify-center text-[#4F9CF9] font-bold text-xl">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#E8E8EA]">@{profile.username}</h1>
                <span className="text-[10px] text-[#4CAF6D] bg-[#0E0E10] border border-[#242427] px-2 py-0.5 rounded font-mono">
                  {profile.role}
                </span>
                {isSelf && (
                  <span className="text-[10px] text-[#4F9CF9] bg-[#0E0E10] border border-[#242427] px-1.5 py-0.5 rounded font-mono">
                    (You)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8A8A8E] mt-0.5">{profile.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#242427] bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#8A8A8E] uppercase block">Karma</span>
              <span className="font-bold text-[#4F9CF9] font-mono mt-0.5 block">{profile.karma} pts</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8A8A8E] uppercase block">Refactors</span>
              <span className="font-bold text-[#4CAF6D] font-mono mt-0.5 block">{profile.acceptedCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8A8A8E] uppercase block">Member</span>
              <span className="font-bold text-[#E8E8EA] mt-0.5 block">{profile.joined}</span>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8E]">
            Submissions by @{username}
          </h3>

          {userPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#151517] border border-[#242427] hover:border-[#3a3a3e] rounded-xl p-4 transition flex gap-3"
            >
              <div className="shrink-0 pt-0.5">
                <UpvoteButton initialVotes={post.upvotes} vertical={true} />
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  onClick={() => onNavigate('post-detail', post.id)}
                  className="text-sm font-semibold text-[#E8E8EA] hover:text-[#4F9CF9] cursor-pointer transition leading-snug mb-2"
                >
                  {post.title}
                </h2>

                <CodeViewer
                  code={post.code}
                  language={post.language}
                  compact={true}
                  maxCompactLines={3}
                />

                <div className="flex items-center justify-between text-xs text-[#8A8A8E] mt-2 pt-1 border-t border-[#242427]">
                  <button
                    onClick={() => onNavigate('post-detail', post.id)}
                    className="flex items-center gap-1 hover:text-[#E8E8EA] transition text-xs"
                  >
                    <MessageSquare size={14} />
                    <span>{post.commentsCount} comments</span>
                  </button>

                  <div className="flex gap-2">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[#8A8A8E]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className="hidden md:block md:col-span-3">
        <RightSidebar onNavigate={onNavigate} />
      </div>
    </div>
  );
}
