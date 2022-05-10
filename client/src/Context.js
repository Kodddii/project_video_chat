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
          console.log(stream);
          userStream = stream;
          console.log(1);
          myVideo.current.srcObject = stream;
        });
    });
    socket.on("joined", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userStream = stream;
          console.log(2);
          myVideo.current.srcObject = stream;
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
        console.log(userStream);
        peer.on("signal", (signal) => {
          socket.emit("sendingSignal", { signal, roomName });
          console.log(signal);
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
      if (!creator) {
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: userStream,
        });
        peer.on("signal", (signal) => {
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












































// import React, { useState, useRef, useEffect } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// const App = () => {
//   const callerVideo = useRef();
//   const calleeVideo = useRef();
//   const connectionRef = useRef();
//   const roomName = "123";
//   const [stream, setStream] = useState();
//   let creator = false;
//   useEffect(() => {
//     const socket = io("https://www.jg-jg.shop");
//     socket.emit("joinRoom", roomName);
//     console.log(1);
//     socket.on("created", () => {
//       creator = true;
//       console.log(2);
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           setStream(stream);
//           callerVideo.current.srcObject = stream;
//         });
//     });
//     console.log(3);
//     socket.on("joined", () => {
//       creator = false;
//       console.log(4);
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           setStream(stream);
//           calleeVideo.current.srcObject = stream;
//         });
//       socket.emit("ready", roomName);
//     });
//     console.log(5);
//     socket.on("ready", () => {
//       if (creator) {
//         const peer = new Peer({ initiator: true, trickle: false, stream });
//         console.log(6);
//         peer.on("signal", (signal) => {
//           socket.emit("sendingSignal", {
//             signal,
//             roomName,
//           });
//         });
//         console.log(7);
//         peer.on("stream", (stream) => {
//           callerVideo.current.srcObject = stream;
//         });
//         console.log(8);
//         connectionRef.current = peer;
//       }
//     });
//     console.log(9);
//     socket.on("offer", (signal) => {
//       if (!creator) {
//         const peer = new Peer({ initiator: false, trickle: false, stream });
//         console.log(10);
//         peer.on("signal", (signal) => {
//           socket.emit("returningSignal", { signal, roomName });

//         });
//         console.log(11);
//         peer.on("stream", (stream) => {
//           calleeVideo.current.srcObject = stream;
//         });
//         console.log(12);
//         socket.on("receivingSignal", (incomingSignal) => {
//           peer.signal(incomingSignal);
//         });
//         console.log(13);
//         connectionRef.current = peer;
//       }
//     });
//   }, []);
//   console.log(14);
//   const leaveCall = () => {
//     connectionRef.destroy();
//   };
//   return (
//     <div>
//       <video playsInline muted ref={callerVideo} autoPlay />
//       <video playsInline muted ref={calleeVideo} autoPlay />
//       <button onClick={leaveCall}>통화 종료</button>
//     </div>
//   );
// };
// export default App;
// 11:22
// socket.on("answerCall", (data) => {		
  // io.to(data.to).emit("callAccepted", data.signal)	});













































// import React, { useState, useRef, useEffect } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// const socket = io("https://www.jg-jg.shop");
// const App = () => {
//   const callerVideo = useRef();
//   const calleeVideo = useRef();
//   const connectionRef = useRef();
//   const roomName = "123";
//   useEffect(() => {
//     socket.emit("joinRoom", roomName);
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         callerVideo.current.srcObject = stream;
//         socket.on("created", () => {
//           const peer = new Peer({ initiator: true, trickle: false, stream });
//           peer.on("signal", (signal) => {
//             socket.emit("sendingSignal", {
//               signal,
//               roomName,
//             });
//           });
//           // peer.on("stream", (currentStream) => {
//           //   calleeVideo.current.srcObject = currentStream;
//           // });
//           // socket.on("callAccepted", (signal) => {
//           //   peer.signal(signal);
//           // });
//           connectionRef.current = peer;
//         });
//         socket.on("joined", (incomingSignal, roomName, stream) => {
//           const peer = new Peer({ initiator: false, trickle: false, stream });
//           peer.on("signal", (signal) => {
//             socket.emit("returningSignal", { signal, roomName });
//           });
//           peer.on("stream", (stream) => {
//             calleeVideo.current.srcObject = stream;
//           });
//           peer.signal(incomingSignal);
//           connectionRef.current = peer;
//         });
//       });
//   }, []);
//   const leaveCall = () => {
//     connectionRef.destroy();
//   };
//   return (
//     <div>
//       <video playsInline muted ref={callerVideo} autoPlay />
//       <video playsInline ref={calleeVideo} autoPlay />
//       <button onClick={leaveCall}>통화 종료</button>
//     </div>
//   );
// };
// export default App;
































// import React, { createContext, useState, useRef, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import Peer from 'simple-peer';

// const SocketContext = createContext();

// // const socket = io('http://localhost:5000');
// const socket = io('https://warm-wildwood-81069.herokuapp.com');

// const ContextProvider = ({ children }) => {
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callEnded, setCallEnded] = useState(false);
//   const [stream, setStream] = useState();
//   const [name, setName] = useState('');
//   const [call, setCall] = useState({});
//   const [me, setMe] = useState('');

//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((currentStream) => {
//         setStream(currentStream);

//         myVideo.current.srcObject = currentStream;
//       });

//     socket.on('me', (id) => setMe(id));

//     socket.on('callUser', ({ from, name: callerName, signal }) => {
//       setCall({ isReceivingCall: true, from, name: callerName, signal });
//     });
//   }, []);

//   const answerCall = () => {
//     setCallAccepted(true);

//     const peer = new Peer({ initiator: false, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('answerCall', { signal: data, to: call.from });
//     });

//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream;
//     });

//     peer.signal(call.signal);

//     connectionRef.current = peer;
//   };

//   const callUser = (id) => {
//     const peer = new Peer({ initiator: true, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
//     });

//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream;
//     });

//     socket.on('callAccepted', (signal) => {
//       setCallAccepted(true);

//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     setCallEnded(true);

//     connectionRef.current.destroy();

//     window.location.reload();
//   };

//   return (
//     <SocketContext.Provider value={{
//       call,
//       callAccepted,
//       myVideo,
//       userVideo,
//       stream,
//       name,
//       setName,
//       callEnded,
//       me,
//       callUser,
//       leaveCall,
//       answerCall,
//     }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export { ContextProvider, SocketContext };
