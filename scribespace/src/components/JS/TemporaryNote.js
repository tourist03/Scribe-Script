import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, PenLine, Palette, 
  Type, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, List, ListOrdered,
  Undo, Redo, Download, Share2
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import '../CSS/TemporaryNote.css';

const TemporaryNote = ({ showAlert }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState('default');
  const [fontSize, setFontSize] = useState('16px');
  const [theme, setTheme] = useState('dark');
  const [showFormatting, setShowFormatting] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    showAuthButtons: false
  });
  const isLoggedIn = !!localStorage.getItem('token');

  // Track changes
  useEffect(() => {
    if (title || content) {
      setHasChanges(true);
    }
  }, [title, content]);

  // Format options
  const fonts = [
    { name: 'Default', value: 'default' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Handwriting', value: 'Caveat, cursive' }
  ];

  const themes = [
    { name: 'Dark', value: 'dark' },
    { name: 'Light', value: 'light' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Night', value: 'night' }
  ];

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    document.execCommand('fontName', false, font);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      showAlert("Please add both title and content", "warning");
      return;
    }

    if (!isLoggedIn) {
      // Store note data temporarily
      localStorage.setItem('pendingTempNote', JSON.stringify({ 
        title: title.trim(), 
        content: content.trim()
      }));
      
      setModalConfig({
        title: 'Login Required',
        message: 'Please login or create an account to save your note.',
        showAuthButtons: true,
        onConfirm: () => {
          navigate('/login');
          setIsModalOpen(false);
        }
      });
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/notes/addnote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: title.trim(),
          description: content.trim(),
          tag: "General"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      setHasChanges(false);
      showAlert("Note saved successfully!", "success");
      navigate('/notes');
    } catch (error) {
      console.error("Error saving note:", error);
      showAlert("Error saving note", "error");
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      setModalConfig({
        title: 'Discard Changes',
        message: 'Are you sure you want to discard your changes? This cannot be undone.',
        showAuthButtons: false,
        onConfirm: () => {
          setIsModalOpen(false);
          navigate('/');
        }
      });
      setIsModalOpen(true);
    } else {
      navigate('/');
    }
  };

  const handleSwitchToDrawing = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    const targetPath = isLoggedIn ? '/add-drawing' : '/tempDraw';

    if (hasChanges) {
      setModalConfig({
        title: 'Switch to Drawing',
        message: 'You have unsaved changes. Are you sure you want to switch to drawing mode?',
        showAuthButtons: false,
        onConfirm: () => {
          setIsModalOpen(false);
          navigate(targetPath);
        }
      });
      setIsModalOpen(true);
    } else {
      navigate(targetPath);
    }
  };

  const handleDownload = () => {
    // Implement download logic
    console.log("Downloading note");
  };

  const handleShare = () => {
    // Implement share logic
    console.log("Sharing note");
  };

  return (
    <div className={`temp-note-container theme-${theme}`}>
      <div className="temp-note-content">
        {/* Header Section */}
        <div className="temp-note-header">
          <div className="header-left">
            <button className="back-button" onClick={handleDiscard}>
              <ArrowLeft size={20} />
            </button>
            <input
              type="text"
              className="note-title"
              placeholder="Untitled Note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="header-right">
            <button className="feature-button" onClick={() => setShowFormatting(!showFormatting)}>
              <Type size={20} />
              <span>Format</span>
            </button>
            <button className="switch-button" onClick={handleSwitchToDrawing}>
              <PenLine size={20} />
              <span>Switch to Drawing</span>
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        {showFormatting && (
          <div className="formatting-toolbar">
            <div className="toolbar-section">
              <select 
                value={selectedFont} 
                onChange={(e) => handleFontChange(e.target.value)}
                className="toolbar-select"
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
              
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value)}
                className="toolbar-select"
              >
                {['12px', '14px', '16px', '18px', '20px', '24px'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="toolbar-section">
              <button onClick={() => handleFormat('bold')}><Bold size={18} /></button>
              <button onClick={() => handleFormat('italic')}><Italic size={18} /></button>
              <button onClick={() => handleFormat('underline')}><Underline size={18} /></button>
            </div>

            <div className="toolbar-section">
              <button onClick={() => handleFormat('justifyLeft')}><AlignLeft size={18} /></button>
              <button onClick={() => handleFormat('justifyCenter')}><AlignCenter size={18} /></button>
              <button onClick={() => handleFormat('justifyRight')}><AlignRight size={18} /></button>
            </div>

            <div className="toolbar-section">
              <button onClick={() => handleFormat('insertUnorderedList')}><List size={18} /></button>
              <button onClick={() => handleFormat('insertOrderedList')}><ListOrdered size={18} /></button>
            </div>

            <div className="toolbar-section">
              <select 
                value={theme} 
                onChange={(e) => handleThemeChange(e.target.value)}
                className="toolbar-select"
              >
                {themes.map(theme => (
                  <option key={theme.value} value={theme.value}>{theme.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div 
          className="note-editor"
          contentEditable
          onInput={(e) => {
            setContent(e.currentTarget.innerHTML);
            setHasChanges(true);
          }}
          style={{ fontFamily: selectedFont, fontSize }}
        />

        {/* Action Buttons */}
        <div className="action-buttons">
          <div className="action-buttons-left">
            <button className="action-btn" onClick={() => handleFormat('undo')}>
              <Undo size={18} />
              <span>Undo</span>
            </button>
            <button className="action-btn" onClick={() => handleFormat('redo')}>
              <Redo size={18} />
              <span>Redo</span>
            </button>
          </div>

          <div className="action-buttons-right">
            <button className="action-btn" onClick={() => handleDownload()}>
              <Download size={18} />
              <span>Download</span>
            </button>
            <button className="action-btn" onClick={() => handleShare()}>
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button className="save-btn" onClick={handleSave}>
              <Save size={18} />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </div>
  );
};

export default TemporaryNote;