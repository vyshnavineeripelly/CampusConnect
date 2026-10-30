import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Clubs from "./pages/Clubs";
import CreateClub from "./pages/CreateClub";
import ClubDetails from "./pages/ClubDetails";
import MyClubs from "./pages/MyClubs";
import EditClub from "./pages/EditClub";
import Resources from "./pages/Resources";
import UploadResource from "./pages/UploadResource";
import ResourceDetails from "./pages/ResourceDetails";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs"
          element={
            <ProtectedRoute>
              <Clubs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/:id"
          element={
            <ProtectedRoute>
              <ClubDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/create"
          element={
            <ProtectedRoute>
              <CreateClub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/:id/edit"
          element={
            <ProtectedRoute>
              <EditClub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-clubs"
          element={
            <ProtectedRoute>
              <MyClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/upload"
          element={
            <ProtectedRoute>
              <UploadResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/:id"
          element={
            <ProtectedRoute>
              <ResourceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import Login from "./pages/Login";

// function App() {
//   return <Login />;
// }

// export default App;

// import Register from "./pages/Register";

// function App() {
//   return <Register />;
// }

// export default App;

// import { useAuth } from "./context/AuthContext";

// function App() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <h1>Loading CampusConnect...</h1>;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-blue-600 text-white">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold">
//           CampusConnect
//         </h1>

//         {user ? (
//           <p className="mt-4 text-xl">
//             Welcome, {user.name}! 👋
//           </p>
//         ) : (
//           <p className="mt-4 text-xl">
//             You are not logged in
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import api from "./services/api";

// function App() {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkBackend = async () => {
//       try {
//         const response = await api.get("/health");

//         setMessage(response.data.message);
//       } catch (error) {
//         console.error("Backend connection failed:", error);
//         setMessage("Backend connection failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkBackend();
//   }, []);

//   return (
//     <div className="min-h-screen bg-blue-600 flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold text-white">
//           CampusConnect
//         </h1>

//         {loading ? (
//           <p className="mt-4 text-xl text-white">
//             Connecting to server...
//           </p>
//         ) : (
//           <p className="mt-4 text-xl text-white">
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

// function App() {
//   return (
//     <div className="min-h-screen bg-blue-600 flex items-center justify-center">
//       <h1 className="text-5xl font-bold text-white">
//         CampusConnect
//       </h1>
//     </div>
//   );
// }

// export default App;


// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
