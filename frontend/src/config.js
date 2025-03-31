//this code is for the prod version

// const GET_API_URL = () => {
//     const protocol = window.location.protocol; // 'http:' ou 'https:'
//     const host = window.location.host; // 'localhost:3000' or 'www.example.com'
//     return `${protocol}//${host}`;
// };

const API_URL = import.meta.env.VITE_API_URL;

export default API_URL;