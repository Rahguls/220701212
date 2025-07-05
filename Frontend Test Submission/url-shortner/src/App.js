import React, { useState, useEffect } from 'react';

const LinkMinimizer = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [linkList, setLinkList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        original: 'https://www.example.com/this-is-a-very-long-url-that-needs-shortening',
        shortened: 'https://tiny.ly/x7k9m2',
        visits: 28,
        createdDate: new Date().toISOString()
      }
    ];
    setLinkList(sampleData);
  }, []);

  // Create random code for short URL
  const createRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  // Validate URL format
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Process URL shortening
  const processUrl = () => {
    setErrorMessage('');

    if (!originalUrl.trim()) {
      setErrorMessage('URL field cannot be empty');
      return;
    }

    if (!validateUrl(originalUrl)) {
      setErrorMessage('Please provide a valid URL format');
      return;
    }

    // Check for duplicates
    const duplicate = linkList.find(link => link.original === originalUrl);
    if (duplicate) {
      setErrorMessage('This URL already exists in your list');
      return;
    }

    const randomCode = createRandomCode();
    const newLink = {
      id: Date.now(),
      original: originalUrl,
      shortened: `https://tiny.ly/${randomCode}`,
      visits: 0,
      createdDate: new Date().toISOString()
    };

    setLinkList([newLink, ...linkList]);
    setOriginalUrl('');
  };

  // Copy shortened URL to clipboard
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Remove URL from list
  const removeUrl = (id) => {
    setLinkList(linkList.filter(link => link.id !== id));
  };

  // Simulate visit tracking
  const trackVisit = (id) => {
    setLinkList(linkList.map(link => 
      link.id === id ? { ...link, visits: link.visits + 1 } : link
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full shadow-lg">
              <span className="text-white text-3xl">⚡</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3">Link Minimizer</h1>
          <p className="text-gray-600 text-lg">Convert lengthy URLs into compact, shareable links</p>
        </div>

        {/* URL Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Paste your long URL here
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://your-very-long-url.com/with/many/parameters"
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && processUrl()}
                />
                <button
                  onClick={processUrl}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-3 font-semibold text-lg"
                >
                  <span>⚡</span>
                  Generate
                </button>
              </div>
            </div>
            {errorMessage && (
              <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* URL List Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            Your Compact Links
          </h2>
          
          {linkList.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="text-gray-400 mb-6">
                <span className="text-8xl">🔗</span>
              </div>
              <p className="text-gray-600 text-xl">No links created yet. Generate your first compact link above!</p>
            </div>
          ) : (
            linkList.map((link) => (
              <div key={link.id} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg font-semibold text-gray-600">Original Link:</span>
                      </div>
                      <div className="text-gray-800 break-all bg-gray-50 p-4 rounded-xl border">
                        {link.original}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg font-semibold text-purple-600">Compact Link:</span>
                      </div>
                      <div className="text-purple-600 font-semibold bg-purple-50 p-4 rounded-xl border border-purple-200">
                        {link.shortened}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-gray-500">
                      <span className="flex items-center gap-2">
                        <span>👁️</span>
                        Visits: {link.visits}
                      </span>
                      <span className="flex items-center gap-2">
                        <span>📅</span>
                        Created: {new Date(link.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => copyToClipboard(link.shortened, link.id)}
                      className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                    >
                      <span>📋</span>
                      {copySuccess === link.id ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => trackVisit(link.id)}
                      className="flex items-center gap-2 px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors font-medium"
                    >
                      <span>🚀</span>
                      Open
                    </button>
                    <button
                      onClick={() => removeUrl(link.id)}
                      className="flex items-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-medium"
                    >
                      <span>❌</span>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Analytics Section */}
        {linkList.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span>📊</span>
              Analytics Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{linkList.length}</div>
                <div className="text-blue-700 font-medium">Total Links</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {linkList.reduce((total, link) => total + link.visits, 0)}
                </div>
                <div className="text-green-700 font-medium">Total Visits</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {linkList.length > 0 ? Math.round(linkList.reduce((total, link) => total + link.visits, 0) / linkList.length) : 0}
                </div>
                <div className="text-orange-700 font-medium">Average Visits</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkMinimizer;