// socket.js
import { io } from 'socket.io-client';

let backendUrl = 'https://caveglass.onrender.com';
const socket = io(backendUrl);
export default socket;