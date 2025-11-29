import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Loader, ExternalLink, AlertCircle, ArrowLeft } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/portfolioConfig';
import { useSearchParams, Link } from 'react-router-dom';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Data State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'Graphic Design & Print', 'Web / Digital', 'Video & Animation'];

  // Dummy fallback data (used if no config is present)
  const fallbackProjects: ProjectItem[] = [
    { id: 1, title: 'Apex Mountain Brand', category: 'Graphic Design & Print', img: 'https://images.unsplash.com/photo-1626785774573-4b7993143a2d?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'EcoStore E-commerce', category: 'Web / Digital', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'TechTalk Podcast', category: 'Video & Animation', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Urban Coffee App', category: 'Web / Digital', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'Neon Energy Drink', category: 'Graphic Design & Print', img: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Corporate Explainer', category: 'Video & Animation', img: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800' },
    { id: 7, title: 'Modern Architecture', category: 'Graphic Design & Print', img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800' },
    { id: 8, title: 'Digital Banking UI', category: 'Web / Digital', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800' },
    { id: 9, title: 'Product Launch 3D', category: 'Video & Animation', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800' },
    { id: 10, title: 'Restaurant Menu', category: 'Graphic Design & Print', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' },
    { id: 11, title: 'Summer Festival', category: 'Graphic Design & Print', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800' },
    { id: 12, title: 'Crypto Dashboard', category: 'Web / Digital', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
  ];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setProjects([]); // Clear current projects during fetch
      setCurrentPage(1); // Reset to page 1

      const { apiKey, folderIds } = PORTFOLIO_CONFIG;
      
      // Determine which folder to load: 
      // 1. Specific folder from URL param?
      // 2. Or Folder associated with Active Tab?
      const currentFolderId = specificFolderId || folderIds[activeTab];
      const isDriveConfigured = apiKey && currentFolderId;

      // If viewing "All" tab and no specific folder is requested -> Use Fallback or logic for 'All'
      // Note: For 'All' in a real app you might want to fetch from multiple folders, 
      // but here we just show fallback if not specific.
      if (!specificFolderId && activeTab === 'All') {
        setProjects(fallbackProjects);
        setIsLoading(false);
        return;
      }

      if (isDriveConfigured) {
        try {
          let allFiles: DriveFile[] = [];
          let pageToken: string | undefined = '';
          const pageSize = 1000; 

          // Pagination Loop (API Side)
          do {
            const query = `'${currentFolderId}' in parents and trashed = false and mimeType contains 'image/'`;
            const fields = 'nextPageToken, files(id, name, mimeType)';
            let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${apiKey}&pageSize=${pageSize}`;
            
            if (pageToken) {
              url += `&pageToken=${pageToken}`;
            }

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API Error: ${response.status} - Check API Key & Folder Permissions`);
            }

            const data = await response.json();

            if (data.files) {
              allFiles = [...allFiles, ...data.files];
            }
            
            pageToken = data.nextPageToken;

          } while (pageToken);

          if (allFiles.length > 0) {
            const driveProjects: ProjectItem[] = allFiles.map((file: DriveFile) => ({
              id: file.id,
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
              category: specificTitle || activeTab,
              // Use lh3.googleusercontent.com for direct image rendering (more reliable than /thumbnail)
              img: `https://lh3.googleusercontent.com/d/${file.id}` 
            }));
            setProjects(driveProjects);
          } else {
             setProjects([]);
          }
        } catch (err: any) {
          console.error("Drive API Error:", err);
          setError(err.message || 'Failed to fetch images from Drive');
          setProjects([]);
        }
      } else {
        // Not configured? Filter the fallback data
        // If specific folder requested but not configured, this might show empty
        const filtered = fallbackProjects.filter(p => p.category === activeTab);
        setProjects(filtered);
      }

      setIsLoading(false);
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
    // The index passed here is from the mapped currentItems (0-8)
    // We need to convert it to the absolute index in the projects array
    setCurrentImageIndex(indexOfFirstItem + index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % projects.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentFolderId = specificFolderId || PORTFOLIO_CONFIG.folderIds[activeTab];
  const isDriveConnected = (specificFolderId || activeTab !== 'All') && currentFolderId && PORTFOLIO_CONFIG.apiKey;

  return (
    <div className="min-h-screen bg-white py-20">
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
             Explore our latest work. {PORTFOLIO_CONFIG.apiKey ? "Synced with our cloud storage." : "Select a category below."}
          </p>
        </div>

        {/* Tabs - Hide if viewing specific folder */}
        {!specificFolderId && (
            <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-100 pb-1">
            {categories.map((cat) => (
                <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                    activeTab === cat
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
            {isDriveConnected && !isLoading && !error && (
            <div 
              className="flex items-center justify-center text-xs font-medium text-green-700 bg-green-50 py-2 px-4 rounded-full border border-green-200"
            >
              <ExternalLink size={14} className="mr-2" />
              <span>Live from Google Drive ({projects.length} items)</span>
            </div>
            )}
            
            {error && (
                <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
                    <AlertCircle size={16} className="mr-2"/>
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
                    className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3] bg-gray-100"
                    onClick={() => openLightbox(index)}
                  >
                    <img 
                      src={project.img} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-blue-400 text-xs font-bold tracking-wider uppercase mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-white text-lg font-bold flex items-center justify-between">
                        {project.title} 
                        <ArrowUpRight size={18} />
                      </h3>
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
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === number
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
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in" onClick={closeLightbox}>
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
          >
            <X size={32} />
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full px-4 relative" onClick={(e) => e.stopPropagation()}>
            <img 
              src={projects[currentImageIndex].img} 
              alt={projects[currentImageIndex].title} 
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-[-3rem] left-0 w-full text-center">
               <h3 className="text-white text-xl font-bold">{projects[currentImageIndex].title}</h3>
               <p className="text-gray-400 text-sm">{projects[currentImageIndex].category}</p>
            </div>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
          >
            <ChevronRight size={40} />
          </button>
          
          <div className="absolute top-6 left-6 text-white/50 text-sm">
             {currentImageIndex + 1} / {projects.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;