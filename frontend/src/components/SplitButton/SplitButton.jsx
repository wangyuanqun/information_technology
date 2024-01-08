import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import SendIcon from '@mui/icons-material/Send';
import { Box } from '@mui/material';
import { CiImport, CiExport } from "react-icons/ci";
import { VscNewFile } from "react-icons/vsc";

const options = ['Import Pipeline', 'Export Pipeline', 'Reset Pipeline'];

export default function SplitButton({cbOnClick}) {
  const initialRender = React.useRef(true);
  const fileInput = React.useRef(null);
  const selectedIndex = React.useRef(1);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleClick = () => {
    if (selectedIndex.current === 0)
      fileInput.current.click();
    else
      cbOnClick(selectedIndex.current);
  };

  const handleMenuItemClick = (event, index) => {
    selectedIndex.current = index;
    setOpen(false);
    handleClick();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const onImportPipelineDone = async (event) => {
    if (event.target.files.length > 0) {
      cbOnClick(0, event.target.files[0]);
    }
    event.target.value = "";
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" sx={{ width: '100%' }}>
        <Button
          // onClick={() => { selectedIndex.current = 0; handleClick(); }}
          variant='contained'
          component="label"
          sx={{ fontSize: '8pt', width: '100%', borderColor: '#8ac1ff !important' }}
          startIcon={<CiImport />} >
          {options[0]}
          <input
            ref={fileInput}
            type="file"
            accept=".ple"
            hidden
            onClick={() => setOpen(false)}
            onChange={onImportPipelineDone}
          />
        </Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 2,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {index === 0 ?
                        <CiImport fontSize='12pt' style={{marginRight: '10px'}}/>
                      : index === 1?
                        <CiExport fontSize='12pt' style={{marginRight: '10px'}}/>
                      :
                        <VscNewFile fontSize='12pt' style={{marginRight: '10px'}}/>
                      }
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}