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
import { HiOutlineDocumentSearch } from 'react-icons/hi';

export default function SplitButtonViewer({ children, title, fileType, cbOnImportFileDone, cbOnShowFiles}) {
  const onShowFilesClick = (event) => {
    event.stopPropagation();
    cbOnShowFiles();
  };

  const onImportFileDone = async (event) => {
    if (event.target.files.length > 0) {
      cbOnImportFileDone(event.target.files[0]);
    }
    event.target.value = "";
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonGroup variant="contained" aria-label="split button" sx={{ width: '100%' }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CiImport />} 
          sx={{ fontSize: '8pt', width: '100%', borderColor: '#8ac1ff !important' }}
        >
          {title}
          <input
            type="file"
            accept={fileType}
            onChange={onImportFileDone}
            hidden
          />
        </Button>
        <Button
          size="small"
          // aria-controls={open ? 'split-button-menu' : undefined}
          // aria-expanded={open ? 'true' : undefined}
          aria-label="View files"
          aria-haspopup="menu"
          onClick={onShowFilesClick}
          sx={{fontSize: '18px'}}
        >
          <HiOutlineDocumentSearch />
        </Button>
      </ButtonGroup>
      {children}
    </Box>
  );
}