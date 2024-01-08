import React, { useCallback, useState, useEffect, useContext } from 'react';
import { UserContext } from '../../userContext';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AppDrawer = () => {

  const systemObj = useContext(UserContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (index) => {
    setCurrentIndex(index);
    
    if (index === 0)
      navigate("/"); 
    else
      navigate("/result");
  }

  useEffect(() => {
    if (location.pathname === "/")
      setCurrentIndex(0);
    else if (location.pathname === "/result")
      setCurrentIndex(1);
  });

  return (
    <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {['Microservies', "Result"].map((text, index) => {
            if (index === 0 || systemObj.hasRunPipeline.current) {
              return (
                (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      selected={currentIndex == index}
                      onClick={() => onClick(index)} 
                      sx={{
                        ml: '10px',
                        mr: '10px',
                        mb: "10px",
                        borderRadius: '10px',
                      }}>
                      <ListItemIcon sx={{ color: currentIndex == index ? 'white' : '#727272' }}>
                        {index % 2 === 0 ? <MiscellaneousServicesIcon /> : <SummarizeIcon />}
                      </ListItemIcon>
                      <ListItemText primary={text} sx={{ color: currentIndex == index ? 'white' : "#727272" }}/>
                    </ListItemButton>
                  </ListItem>
                )
              )
            }
          })}
        </List>
      </Drawer>
  );
}

export default AppDrawer
