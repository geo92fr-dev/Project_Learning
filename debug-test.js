// Test rapide pour vérifier DOMPurify
import DOMPurify from 'dompurify';

const title = 'Test Markdown';
const sanitized = DOMPurify.sanitize(title);

console.log('Original:', title);
console.log('Sanitized:', sanitized);
console.log('Same?:', title === sanitized);
