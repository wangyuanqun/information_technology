import React, { useCallback, useState, useEffect, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Tooltip } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';

const ExpandMenu = ({style, options, cbOnAddClick}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onOptionClick = (evt) => {
    cbOnAddClick(evt.target.value);
    handleClose();
  }

  return (
    <div style={style} >
      <Tooltip title="Add Node">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        sx={{ zIndex: 2 }}
        onClose={handleClose}
        // PaperProps={{
        //   style: {
        //     width: '20ch',
        //   },
        // }}
      >
        {options.map((option, idx) => (
          <MenuItem key={option} value={idx} onClick={onOptionClick}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default ExpandMenu
