import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const adminPages = [
  { name: "Dashboard", route: "/admin" },
  { name: "Librarian Manage", route: "/librarianmanage" },
  { name: "Branch Manage", route: "/branchmanage" },
  { name: "Announcements Manage", route: "/announcementsmanage" },
];

const librarianPages = [
  { name: "Book Manage", route: "/bookmanage" },
  { name: "Reservations Manage", route: "/reservationsmanage" },
  { name: "Branch Manage", route: "/branchmanage" },
  { name: "Borrowed List Manage", route: "/borrowed" },
];

const loggedInActions = ["Profile", "Logout"];

function ResponsiveAppBar({ onLogout }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate(); // For navigation on logout

  // Get role from localStorage
  const role = localStorage.getItem("role"); // Assume "admin" or "librarian"
  const isLoggedIn = Boolean(role);

  // Determine pages based on role
  const pages = role === "admin" ? adminPages : role === "librarian" ? librarianPages : [];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("role"); // Clear role
    localStorage.removeItem("token"); // Clear token
    handleCloseUserMenu(); // Close the user menu
    navigate("/login"); // Redirect to login form
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Library Logo"
            sx={{
              display: { xs: "none", md: "flex" },
              height: 40,
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "'Montserrat Alternates', sans-serif",
              fontWeight: 700,
              letterSpacing: ".0rem",
              color: "#0653B8",
              textDecoration: "none",
            }}
          >
            Book Nest
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to={page.route} style={{ textDecoration: "none", color: "#434343" }}>
                      {page.name}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                md: "flex",
                marginRight: "80px",
                gap: "16px",
                justifyContent: "center",
              },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.route}
                sx={{ my: 2, color: "#434343", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* User Avatar */}
          {isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {loggedInActions.map((action) => (
                  <MenuItem
                    key={action}
                    onClick={action === "Logout" ? handleLogout : handleCloseUserMenu}
                  >
                    <Typography textAlign="center">{action}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
