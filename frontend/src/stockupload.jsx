import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from './components/BackButton';

function StockUpload() {
  const [csvFile, setCsvFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!token || !user || user.role !== 'admin') return null;

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    if (e.target.files[0]) {
      handlePreview(e.target.files[0]);
    }
  };

  const handlePreview = async (file) => {
    const selectedFile = file || csvFile;
    if (!selectedFile) return alert('Please upload a file');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post('http://localhost:5000/api/stocks/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setPreviewData(res.data.preview);
    } catch (err) {
      console.error(err);
      alert('Preview failed');
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/stocks/save', { data: previewData }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <div>
      <BackButton />
      <h2>Upload CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {previewData.length > 0 && (
        <div className="preview-table-container">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={handleSave}>Save to Database</button>
          </div>
          <h3>Preview</h3>
          <table className="modern-table">
            <thead>
              <tr>
                {Object.keys(previewData[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {previewData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      )}
    </div>
  );
}

export default StockUpload;
