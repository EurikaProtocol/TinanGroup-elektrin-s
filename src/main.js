import './style.css';
import { mountLayout } from './lib/layout.js';

mountLayout(location.pathname.split('/').pop() || 'index.html');
