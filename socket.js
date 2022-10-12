import { io } from "socket.io-client";
// export const socket = io("https://lapiconera.herokuapp.com/", {
//   reconnection: true,
//   reconnectionDelay: 500,
//   reconnectionAttempts: 10,
// });
export const socket = io("http://192.168.0.14:4000/", {
  'reconnection': true,
  'reconnectionDelay': 500,
  'reconnectionAttempts': 10
});
