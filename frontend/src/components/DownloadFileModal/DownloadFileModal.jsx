import { Box, Divider, Typography } from '@mui/material';
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from 'react';
import { BASEURL } from "../../helper";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  }
}));

const DownloadFileModal = ({ title, open, fileList, cbOnClose }) => {

  const handleClose = (event) => {
    event.stopPropagation();
    cbOnClose();
  }

  const downloadOnClick = (item) => {
    const a = document.createElement('a')
    a.download = item.src;
    a.href = `${BASEURL}/download_file?name=${item.src}&folder=${item.folder}`
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ height: '100%', p: 0 }}>
          {
            fileList.length > 0 ? (
              fileList.map((item, index) => {
                return (
                  <Box key={index} sx={{ display: 'flex', width: '500px', height: '60px', alignItems: 'center'}}>
                    <Box sx={{flex: 1, display: 'flex' }}>
                      File {index + 1}
                    </Box>
                    <Box sx={{ flex: 4, display: 'flex', flexDirection: 'column' }}>
                      <Typography>
                        Name: {item.src}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        <Typography variant='caption'>
                          Format: {item.ext}
                          {/* TODO: make it human readable */}
                        </Typography>
                      </Box>
                      { index === fileList.length - 1 ? null : <Divider sx={{pt: '10px'}}/> }
                    </Box>
                    <Button
                      onClick={() => downloadOnClick(item)}
                    >
                      Download
                    </Button>
                  </Box>
                )
              })
            ) : (
              <Box sx={{ width: '500px' }} >
                No file available
              </Box>
            )
          }
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{ color: "white" }}
          >
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
  )
}

export default DownloadFileModal
