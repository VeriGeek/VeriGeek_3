import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem,
  Container, Avatar, Tooltip, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, Badge, InputBase, useMediaQuery, useTheme
} from '@mui/material';
import {
  Menu as MenuIcon, AccountCircle, Notifications, Bookmark, Dashboard,
  ExitToApp, Person, Code, Forum, MenuBook, Search, Close, Work
} from '@mui/icons-material';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Mock authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('demoUserLoggedIn') === 'true');
  
  // State for menus
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Sample notifications
  const notifications = [
    { id: 1, text: 'Your solution for "Creating a 2-to-1 Multiplexer" was evaluated', unread: true },
    { id: 2, text: 'Jane Smith replied to your forum post', unread: true },
    { id: 3, text: 'New module available: "Sequential Circuits"', unread: false }
  ];
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('demoUserLoggedIn');
    setIsLoggedIn(false);
    handleUserMenuClose();
    navigate('/');
  };
  
  const toggleSearchBar = () => {
    setSearchOpen(!searchOpen);
  };
  
  // Navigation links
  const navLinks = [
    { text: 'Home', to: '/', icon: <Dashboard /> },
    { text: 'Modules', to: '/modules', icon: <MenuBook /> },
    { text: 'Code Editor', to: '/editor', icon: <Code /> },
    { text: 'Forum', to: '/forum', icon: <Forum /> },
    { text: 'Resources', to: '/resources', icon: <Bookmark /> },
    { text: 'Research', to: '/research', icon: <MenuBook /> },
    { text: 'Blog', to: '/blog', icon: <MenuBook /> },
    { text: 'Careers', to: '/careers', icon: <Work /> },
  ];
  
  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="img" 
            src="/images/BACKGROUNDLESS_LOGO.png" 
            alt="VeriGeek Logo" 
            sx={{ 
              height: 28, 
              mr: 1 
            }}
          />
          VeriGeek
        </Typography>
        <IconButton color="inherit" onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem 
            button 
            component={Link} 
            to={link.to} 
            key={link.text}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              {link.icon}
            </ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {isLoggedIn ? (
        <List>
          <ListItem button component={Link} to="/profile">
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button component={Link} to="/bookmarks">
            <ListItemIcon><Bookmark /></ListItemIcon>
            <ListItemText primary="Bookmarks" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button component={Link} to="/login">
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={Link} to="/register">
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="Register" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#6a0dad' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Logo/Title */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <Box 
              component="img" 
              src="/images/BACKGROUNDLESS_LOGO.png" 
              alt="VeriGeek Logo" 
              sx={{ 
                height: 32, 
                mr: 1 
              }}
            />
            VERIGEEK
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((link) => (
              <Button
                key={link.text}
                component={Link}
                to={link.to}
                sx={{ color: 'white', display: 'block', mx: 1 }}
              >
                {link.text}
              </Button>
            ))}
          </Box>

          {/* Search */}
          {searchOpen ? (
            <Box sx={{ 
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 1,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
              marginRight: 2,
              marginLeft: 0,
              width: { xs: '100%', sm: '50%', md: '35%' },
            }}>
              <Box sx={{ 
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Search />
              </Box>
              <InputBase
                placeholder="Search modules, exercises…"
                sx={{
                  color: 'inherit',
                  padding: theme.spacing(1, 1, 1, 0),
                  // vertical padding + font size from searchIcon
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  transition: theme.transitions.create('width'),
                  width: '100%',
                }}
                autoFocus
                onBlur={toggleSearchBar}
              />
            </Box>
          ) : (
            <IconButton color="inherit" onClick={toggleSearchBar}>
              <Search />
            </IconButton>
          )}

          {/* Auth Buttons or User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton 
                    color="inherit" 
                    onClick={handleNotificationsOpen}
                    sx={{ mr: 1 }}
                  >
                    <Badge 
                      badgeContent={notifications.filter(n => n.unread).length} 
                      color="error"
                    >
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
                
                {/* User Menu */}
                <Tooltip title="Open profile menu">
                  <IconButton 
                    onClick={handleUserMenuOpen} 
                    sx={{ p: 0, ml: 1 }}
                  >
                    <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
                  </IconButton>
                </Tooltip>
                
                {/* User Menu Dropdown */}
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={userMenuAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem component={Link} to="/bookmarks" onClick={handleUserMenuClose}>
                    <ListItemIcon>
                      <Bookmark fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Bookmarks</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
                
                {/* Notifications Menu */}
                <Menu
                  sx={{ mt: '45px', width: 320 }}
                  id="menu-notifications"
                  anchorEl={notificationsAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(notificationsAnchor)}
                  onClose={handleNotificationsClose}
                  PaperProps={{
                    sx: { width: 320, maxHeight: 500 }
                  }}
                >
                  <Typography sx={{ p: 2 }} variant="h6">
                    Notifications
                  </Typography>
                  <Divider />
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification) => (
                        <MenuItem 
                          key={notification.id}
                          onClick={handleNotificationsClose}
                          sx={{ 
                            backgroundColor: notification.unread ? 'rgba(106, 13, 173, 0.08)' : 'inherit',
                            py: 1.5 
                          }}
                        >
                          <ListItemText 
                            primary={notification.text}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </MenuItem>
                      ))}
                      <Divider />
                      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                        <Button size="small">View All</Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No notifications to display
                      </Typography>
                    </Box>
                  )}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained"
                  color="secondary"
                  component={Link} 
                  to="/register"
                  sx={{ bgcolor: 'white', color: '#6a0dad' }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header; 