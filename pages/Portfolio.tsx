import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Loader, ExternalLink, AlertCircle, ArrowLeft } from 'lucide-react';
import { getPortfolios } from '../lib/portfolioService';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface ProjectItem {
  id: string | number;
  title: string;
  category: string;
  img: string;
}

const Portfolio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const specificFolderId = searchParams.get('folderId');
  const specificTitle = searchParams.get('title');

  const [activeTab, setActiveTab] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Data State
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'Shopify', 'React', 'WordPress', 'Other'];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setProjects([]);
      setCurrentPage(1);

      try {
        const fetchedItems = await getPortfolios();

        // Sort by order if available
        const sortedItems = [...fetchedItems].sort((a, b) => (a.order || 0) - (b.order || 0));

        // Filter based on active tab or specific params
        let filteredItems = sortedItems;

        if (activeTab !== 'All') {
          filteredItems = filteredItems.filter(item => item.category === activeTab);
        }

        setProjects(filteredItems);

      } catch (err: any) {
        console.error("Error fetching portfolios:", err);
        setError("Failed to load portfolio items.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, specificFolderId, specificTitle]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const gridElement = document.getElementById('portfolio-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setCurrentProjectIndex(indexOfFirstItem + index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentProjectIndex];

  return (
    <div className="min-h-screen bg-white py-20">
      <Helmet>
        <title>Our Portfolio | wbify Creative Studio</title>
        <meta name="description" content="Explore our portfolio of graphic design, web development, and video projects. See how we help brands stand out." />
        <link rel="canonical" href="https://www.wbify.com/portfolio" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          {specificFolderId ? (
            <div className="mb-4">
              <Link to="/portfolio" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6">
                <ArrowLeft size={18} className="mr-2" /> Back to Main Portfolio
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{specificTitle || 'Project Gallery'}</h1>
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Portfolio</h1>
          )}

          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our latest work. Select a category below.
          </p>
        </div>

        {/* Tabs - Hide if viewing specific folder */}
        {!specificFolderId && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-100 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${activeTab === cat
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-slate-900'
                  }`}
              >
                {cat}
                {activeTab === cat && (
                  <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex justify-center mb-10 space-x-4">
          {error && (
            <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Grid or Loader */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <>
            <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.length > 0 ? (
                currentItems.map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Device Preview Mockup */}
                    <div 
                      className="relative aspect-[16/10] bg-gray-100 overflow-hidden cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full text-slate-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <ArrowUpRight size={24} />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-blue-600 text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-blue-50 rounded">
                          {project.category}
                        </span>
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      <h3 className="text-slate-900 text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-[10px] text-gray-400 px-1">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400">
                  <p>No projects found in this collection.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && projects.length > itemsPerPage && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-slate-900'}`}
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === number
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-slate-900'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-[110]"
          >
            <X size={32} />
          </button>

          <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-8" onClick={(e) => e.stopPropagation()}>
            {/* Image Container */}
            <div className="relative flex-1 flex items-center justify-center w-full h-full max-h-[50vh] md:max-h-full">
              <button
                onClick={prevProject}
                className="absolute left-0 text-white/50 hover:text-white transition-colors p-2 z-10"
              >
                <ChevronLeft size={48} />
              </button>

              <img
                src={currentProject.imageUrl}
                alt={currentProject.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />

              <button
                onClick={nextProject}
                className="absolute right-0 text-white/50 hover:text-white transition-colors p-2 z-10"
              >
                <ChevronRight size={48} />
              </button>
            </div>

            {/* Project Details */}
            <div className="w-full md:w-80 flex flex-col text-white animate-fade-in-up">
              <span className="text-blue-400 text-sm font-bold tracking-wider uppercase mb-2">
                {currentProject.category}
              </span>
              <h2 className="text-3xl font-bold mb-4">{currentProject.title}</h2>
              
              {currentProject.description && (
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {currentProject.description}
                </p>
              )}

              {currentProject.technologies && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map(tech => (
                      <span key={tech} className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentProject.link && (
                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Visit Website <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === currentProjectIndex ? 'w-8 bg-blue-600' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;