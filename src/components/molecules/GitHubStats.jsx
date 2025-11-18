import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaBook } from 'react-icons/fa';

/**
 * GitHub Stats Component
 * Displays real-time GitHub statistics
 */
const GitHubStats = ({ username = 'medhatjachour' }) => {
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    followers: 0,
    loading: true
  });

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();
        
        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposResponse.json();
        
        // Calculate total stars and forks
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((acc, repo) => acc + repo.forks_count, 0);
        
        setStats({
          totalRepos: userData.public_repos,
          totalStars,
          totalForks,
          followers: userData.followers,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchGitHubStats();
  }, [username]);

  const statItems = [
    { icon: FaBook, label: 'Repositories', value: stats.totalRepos, color: 'from-blue-500 to-cyan-400' },
    { icon: FaStar, label: 'Stars', value: stats.totalStars, color: 'from-yellow-500 to-orange-400' },
    { icon: FaCodeBranch, label: 'Forks', value: stats.totalForks, color: 'from-emerald-500 to-teal-400' },
    { icon: FaGithub, label: 'Followers', value: stats.followers, color: 'from-purple-500 to-pink-400' }
  ];

  if (stats.loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="h-12 w-12 bg-white/10 rounded-xl mb-4" />
            <div className="h-4 bg-white/10 rounded mb-2" />
            <div className="h-6 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all group"
        >
          <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <item.icon className="text-2xl text-white" />
          </div>
          <p className="text-gray-400 text-sm mb-1">{item.label}</p>
          <p className="text-3xl font-bold text-white">
            {item.value.toLocaleString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default GitHubStats;
