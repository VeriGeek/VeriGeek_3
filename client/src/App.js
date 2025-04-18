import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/index.css';

// Import pages
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import ChapterView from './pages/ChapterView';
import CodeEditor from './pages/CodeEditor';
import Forum from './pages/Forum';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import SingleBlog from './pages/SingleBlog';
import CommunityForum from './components/CommunityForum';
import Research from './pages/Research';
import Contact from './pages/Contact';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Create a theme with our purple color
const theme = createTheme({
  palette: {
    primary: {
      main: '#6a0dad',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  useEffect(() => {
    // Set document title
    document.title = 'VeriGeek - Empower Your Logic, Code Your Circuit!';
  }, []);

  const routes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/modules",
      element: <Modules />,
    },
    {
      path: "/modules/:id",
      element: <ModuleDetail />,
    },
    {
      path: "/modules/:moduleId/chapters/:chapterId",
      element: <ChapterView />,
    },
    {
      path: "/editor",
      element: <CodeEditor />,
    },
    {
      path: "/modules/:moduleId/exercises/:exerciseId",
      element: <CodeEditor />,
    },
    {
      path: "/forum",
      element: <CommunityForum />,
    },
    {
      path: "/resources",
      element: <Resources />,
    },
    {
      path: "/careers",
      element: <Careers />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/blog",
      element: <Blog />,
    },
    {
      path: "/blog/:id",
      element: <SingleBlog />,
    },
    {
      path: "/research",
      element: <Research />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "*",
      element: <Home />,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App; 