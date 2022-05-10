import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
const App = () => {
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const roomName = "123";
  let userStream = null;
  let creator = false;
  useEffect(() => {
    const socket = io("https://www.jg-jg.shop");
    socket.emit("joinRoom", roomName);
    socket.on("created", () => {
      creator = true;
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userStream = stream;
          myVideo.current.srcObject = stream;
          console.log(1);
        });
    });
    socket.on("joined", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userStream = stream;
          myVideo.current.srcObject = stream;
          console.log(2);
        });
      socket.emit("ready", roomName);
    });
    socket.on("ready", () => {
      if (creator) {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: userStream,
        });
        peer.on("signal", (signal) => {
          socket.emit("sendingSignal", { signal, roomName });
          console.log(3);
        });
        peer.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
          console.log(4);
        });
        socket.on("receivingSignal", (signal) => {
          peer.signal(signal);
          console.log(5);
        });
        connectionRef.current = peer;
      }
    });
    socket.on("offer", (incomingSignal) => {
      console.log({incomingSignal})
      if (!creator) {
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: userStream,
        });
        peer.on("signal", (signal) => {
          console.log({signal})
          socket.emit("returningSignal", { signal, roomName });
          console.log(6);
        });
        peer.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
          console.log(7);
        });
        peer.signal(incomingSignal);
        console.log(8);
        connectionRef.current = peer;
      }
    });
  }, []);
  const leaveCall = () => {
    connectionRef.destroy();
  };
  return (
    <div>
      <video playsInline muted ref={myVideo} autoPlay />
      <video playsInline muted ref={userVideo} autoPlay />
      <button onClick={leaveCall}>통화 종료</button>
    </div>
  );
};
export default App;





















































// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';
// import Peer from 'simple-peer';
// const socket = io('https://www.jg-jg.shop');
// const VideoChat = (props) => {
//   const callerVideo = useRef();
//   const calleeVideo = useRef();
//   const connectionRef = useRef();
//   const roomName = props.match.params.roomName;
//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         callerVideo.current.srcObject = stream;
//         socket.emit('joinRoom', roomName);
//         socket.on('callerPeer', (userToSignal, callerId, stream) => {
//           const peer = new Peer({ initiator: true, trickle: false, stream });
//           peer.on('signal', (signal) => {
//             socket.emit('sendingSignal', {
//               userToSignal,
//               callerId,
//               signal,
//             });
//           });
//           peer.on('stream', (currentStream) => {
//             calleeVideo.current.srcObject = currentStream;
//           });
//           socket.on('callAccepted', (signal) => {
//             peer.signal(signal);
//           });
//           connectionRef.current = peer;
//         });
//         socket.on('calleePeer', (incomingSignal, callerId, stream) => {
//           const peer = new Peer({ initiator: false, trickle: false, stream });
//           peer.on('signal', (signal) => {
//             socket.emit('returningSignal', { signal, to: callerId });
//           });
//           peer.on('stream', (stream) => {
//             calleeVideo.current.srcObject = stream;
//           });
//           peer.signal(incomingSignal);
//           connectionRef.current = peer;
//         });
//       });
//   }, []);
//   return (
//     <div>
//       <video playsInline muted ref={callerVideo} autoPlay />
//       <video playsInline ref={calleeVideo} autoPlay />
//     </div>
//   );
// };
// export default VideoChat;