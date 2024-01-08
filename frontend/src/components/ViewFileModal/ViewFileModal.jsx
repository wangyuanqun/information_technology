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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  }
}));

const ViewFileModal = ({ title, open, fileList, cbOnClose, cbDeleteFiles }) => {
  
  const [confirmed, setConfirmed] = useState(false);

  const handleClose = (event) => {
    event.stopPropagation();
    setConfirmed(false);
    cbOnClose();
  }

  const deleteAll = (e) => {
    if (confirmed) {
      handleClose(e);
      cbDeleteFiles();
    } else {
      setConfirmed(true);
    }
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
                        Name: {item.name}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        <Typography variant='caption'>
                          Size: {item.size}
                        </Typography>
                        {/* <Typography variant='caption' sx={{ flex: 1, ml: '20px' }}>
                          Format: csv
                        </Typography> */}
                      </Box>
                      { index === fileList.length - 1 ? null : <Divider sx={{pt: '10px'}}/> }
                    </Box>
                  </Box>
                )
              })
            ) : (
              <Box sx={{ width: '500px' }} >
                No file uploaded
              </Box>
            )
          }
        </DialogContent>
        <DialogActions>
          {fileList.length > 0 &&
            <Button
              variant="contained"
              color="error"
              onClick={deleteAll}
            >
              {confirmed?
                "Confirm":
                "Delete All"
              }
            </Button>
          }
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

export default ViewFileModal
