import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getKamidenClient } from '../lib/kamiden';
import { RetroButton } from '../components/ui/8bit/RetroElements'; // Reuse if possible or use the pixel-button class

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('kills');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const tabs = [
    { id: 'kills', label: 'Most Kills', icon: 'fas fa-skull' },
    { id: 'deaths', label: 'Most Deaths', icon: 'fas fa-ghost' },
    { id: 'distance', label: 'Traveled', icon: 'fas fa-hiking' },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const client = getKamidenClient();
      if (!client) {
        console.warn("Kamiden client not initialized");
        setLoading(false);
        return;
      }
      let response;
      try {
        switch (activeTab) {
          case 'kills':
            response = await client.getKillsByAccount({});
            break;
          case 'deaths':
            response = await client.getDeathsByAccount({});
            break;
          case 'distance':
            response = await client.getMovementsByAccount({});
            break;
          default:
            response = { Rows: [] };
        }
        console.log("Leaderboard Data:", response); // Debugging
        const rawData = response.Rows || [];
        // Add original rank to each item
        const rankedData = rawData.map((item, index) => ({
          ...item,
          originalRank: index + 1
        }));
        setData(rankedData);
        setFilteredData(rankedData);
        setCurrentPage(1); // Reset to first page on tab change
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);
  
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = data.filter(item => 
      item.Name.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, data]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getChangeIcon = (change) => {
    // Hidden for now as backend doesn't provide this data
    return null;
    /*
    switch(change) {
      case 'up':
        return <i className="fas fa-arrow-up text-green-500"></i>;
      case 'down':
        return <i className="fas fa-arrow-down text-red-500"></i>;
      default:
        return <i className="fas fa-minus text-gray-500"></i>;
    }
    */
  };
  
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <i className="fas fa-trophy trophy-gold"></i>;
      case 2:
        return <i className="fas fa-trophy trophy-silver"></i>;
      case 3:
        return <i className="fas fa-trophy trophy-bronze"></i>;
      default:
        return <span className="text-white">{rank}</span>;
    }
  };
  
  const getTabIcon = (id) => {
    const tab = tabs.find(tab => tab.id === id);
    return tab ? <i className={`${tab.icon} mr-2`}></i> : null;
  };
  
  const getUnit = (item) => {
    return item.unit ? item.unit : '';
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="text-center mb-8 relative">
        <Link to="/" className="absolute left-0 top-0 text-white hover:text-green-400 no-underline text-xs md:text-sm z-50 flex items-center">
          <i className="fas fa-arrow-left mr-2"></i> Back
        </Link>
        <h1 className="text-3xl mb-2 text-green-400 blink">LEADERBOARD</h1>
        <div className="h-2 bg-green-500 w-32 mx-auto pixel-border"></div>
      </div>
      
      <div className="mb-6 grid grid-cols-3 md:grid-cols-6 gap-1 pixel-border p-1 bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pixel-button py-2 px-1 text-xs md:text-sm text-center ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex flex-col items-center justify-center h-full">
                <i className={`${tab.icon} mb-1 md:mb-0 md:mr-2`}></i>
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden text-[10px]">{tab.label.split(' ')[1] || tab.label.split(' ')[0]}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="bg-gray-800 p-4 pixel-border min-h-[400px]">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl text-green-400 flex items-center">
            {getTabIcon(activeTab)}
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
          <div className="text-xs text-gray-400">Updated 5 min ago</div>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 border-2 border-gray-700 focus:border-green-500 outline-none font-['Press_Start_2P'] text-xs"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64 text-green-400">
            LOADING...
          </div>
        ) : (
          <div className="overflow-hidden">
            {paginatedData.map((item, index) => (
              <div 
                key={index} 
                className={`leaderboard-row flex items-center p-3 ${item.originalRank === 1 ? 'bg-green-900 bg-opacity-30' : ''}`}
              >
                <div className="w-16 text-center mr-4 shrink-0">
                  {getRankIcon(item.originalRank)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-bold text-sm truncate pr-2 text-white">{item.Name}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm md:text-lg font-bold text-yellow-300">
                    {Number(item.Value).toLocaleString()} {getUnit(item)}
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
                <div className="text-center py-10 text-gray-500">No data available</div>
            )}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-4">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`pixel-button px-3 py-2 text-xs ${currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`pixel-button px-3 py-2 text-xs ${currentPage === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Leaderboard;

