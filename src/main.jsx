import React from 'react';
import { createRoot } from 'react-dom/client';

// Original stylesheets, imported unmodified.
import '../css/tokens.css';
import '../css/style.css';

import App from './App.jsx';

// Same gate as the original static site: the CSS only hides content while JS
// is running. It must be in place before the first React paint so nothing ever
// flashes.
document.documentElement.classList.add('anim');

createRoot(document.getElementById('root')).render(<App />);