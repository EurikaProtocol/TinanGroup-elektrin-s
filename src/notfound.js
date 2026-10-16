import './style.css';
import { mountLayout } from './lib/layout.js';

// 404 is served on any nested URL, so links must be root-absolute.
mountLayout('', '/');
