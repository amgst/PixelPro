import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getPortfolios, PortfolioItem } from '../lib/portfolioService';
import { getPreferredPortfolioImage } from '../lib/webPortfolioImages';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  useEffect(() => {
    let active = true;
    getPortfolios().then(items => {
      if (active) setProjects(items.filter(item => item.isPublic !== false && !item.isConcept)
        .sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured) || (a.order || 0) - (b.order || 0)).slice(0, 3));
    }).catch(() => { /* Keep the homepage available if portfolio loading fails. */ });
    return () => { active = false; };
  }, []);
  if (!projects.length) return null;
  return (
    <section className="bg-slate-50 py-16 mt-12" aria-labelledby="featured-projects-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div><h2 id="featured-projects-heading" className="text-3xl font-bold text-slate-900 mb-3">See what we've built</h2><p className="text-gray-600">Explore selected projects from our portfolio.</p></div>
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-blue-600 font-semibold">View all projects <ArrowRight size={18} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={project.id} to={`/portfolio?category=${encodeURIComponent(project.category)}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow focus-visible:outline-blue-600">
              <img src={getPreferredPortfolioImage(project, index)} alt={project.title} loading="lazy" width={640} height={400} className="w-full aspect-[8/5] object-cover object-top" />
              <div className="p-6"><p className="text-sm text-blue-600 mb-2">{project.category}</p><h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>{project.description && <p className="text-gray-600 line-clamp-3">{project.description}</p>}<span className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-4">Explore portfolio <ArrowRight size={16} /></span></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
