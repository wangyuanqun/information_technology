import { Box, Typography, CssBaseline, Divider, Button, IconButton, ButtonGroup } from '@mui/material';
import React, { useCallback, useState, useEffect, useContext, useInsertionEffect } from 'react';
import { message } from 'antd';
import { UserContext } from '../../userContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASEURL } from '../../helper';
import DownloadFileModal from '../../components/DownloadFileModal';

// Icon
import { LiaCloudDownloadAltSolid } from "react-icons/lia";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import axios from "axios";

import "./ResultPage.css";

const drawerWidth = 240;

const ResultPage = ({style}) => {

  const systemObj = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [html, setHTML] = React.useState({__html: ""})
  const [currResult, setCurrResult] = React.useState(0);
  const [fileModalOpen, setFileModalOpen] = React.useState(false);

  useEffect(() => {
    if (systemObj.pipelineResult.length > currResult) {
      const type = systemObj.pipelineResult[currResult].type;
      if (type === "graph") {
        const src = systemObj.pipelineResult[currResult].src;
        const folder = systemObj.pipelineResult[currResult].folder;
        setHTML({
          __html: `<iframe src="${BASEURL}/show_html?name=${src}&folder=${folder}"></iframe>`
        });
      }
    }
  }, [currResult]);

  useEffect(() => {
    if (location.pathname === "/result" && !systemObj.hasRunPipeline.current)
      navigate("/");

    if (systemObj.popupMsg.current !== "")
      createMessageDialog("runPipeline", "success", systemObj.popupMsg.current);  
      systemObj.popupMsg.current = "";
  }, []);

  const onPrevClick = () => {
    if (currResult > 0)
      setCurrResult(currResult-1);
  }

  const onNextClick = () => {
    if (systemObj.pipelineResult.length > currResult + 1)
      setCurrResult(currResult+1);
  }

  const createVisualization = () => {
    if (systemObj.pipelineResult.length > currResult) {
      const type = systemObj.pipelineResult[currResult].type;
      const src = systemObj.pipelineResult[currResult].src;
      const folder = systemObj.pipelineResult[currResult].folder;
      if (type === "model") {
        return (
          <Box>
            Download model
          </Box>
        )
      }
      else if (type === "image") {
        return (
          <Box sx={{ display: 'flex', justifyContent: "center" }}>
            <img src={`${BASEURL}/download_file?name=${src}&folder=${folder}`} style={{ width: '90%'}}/>
          </Box>
        )
      }
      else if (type === "graph") {
        return <div dangerouslySetInnerHTML={html} style={{ height: '98%'}}/>
      }
    }
  }

  const onDownloadClick = () => {
    if (systemObj.pipelineResult.length > currResult) {
      if (systemObj.pipelineResult[currResult].type === "model" ||
          systemObj.pipelineResult[currResult].type === "image" ||
          systemObj.pipelineResult[currResult].type === "graph") {
        const src = systemObj.pipelineResult[currResult].src;
        const folder = systemObj.pipelineResult[currResult].folder;
        const a = document.createElement('a')
        a.download = systemObj.pipelineResult[currResult].src;
        a.href = `${BASEURL}/download_file?name=${src}&folder=${folder}`
        a.rel = 'noopener'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
  }

  const createMessageDialog = (key, type, content, duration=2) => {
    messageApi.open({
      key: key,
      type: type,
      content: content,
      duration: duration,
      style: { position: 'relative', top: '60px' }
    });
  }

  const onShowFilesClick = (event) => {
    event.stopPropagation();
    setFileModalOpen(true);
  };

  const showFileName = () => {
    if (systemObj.pipelineResult.length > currResult) {
      const type = systemObj.pipelineResult[currResult].type;
      if (type === "graph") {
        return systemObj.pipelineResult[currResult].src;
      }
    }
    return "";
  }

  return (
    <Box sx={{ height: 'calc(100% - 65px)',
                  position: 'relative',
                  top: '64px',
                  left: `${drawerWidth/2}px`,
                  display: 'flex',
                  flexDirection: 'column' }}>
      {contextHolder}
      <CssBaseline />
      <Box sx={{ height: '75px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '50px', mt: '15px' }}>
          <Box sx={{ flex: 7 }}>
            <Box>
              <Typography variant='h5' sx={{ fontSize: '16pt', fontWeight: 600 }}>
                Result
              </Typography>
            </Box>
            <Box>
              <Typography variant='h6' sx={{ fontSize: '12pt', fontWeight: 300, color: 'grey' }}>
                Visually represent your results
              </Typography>
            </Box>
          </Box>
          <Box sx={{ alignItems: "center", justifyContent: 'right', display: 'inherit' }}>
            <Button
              variant="outlined"
              onClick={onShowFilesClick}
            >
              Download Processed Files
            </Button>
            <DownloadFileModal 
              title="Download Processed Files"
              open={fileModalOpen}
              fileList={systemObj.pipelineAvailableFiles}
              cbOnClose={() => {
                setFileModalOpen(false)
              }}
            />
          </Box>
          <Box sx={{ flex: 1.5, alignItems: "center", justifyContent: 'right', display: 'inherit', ml: '8px' }}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button startIcon={<ArrowBackIosIcon style={{ fontSize: '14px' }} />} onClick={onPrevClick} disabled={currResult <= 0} >Prev</Button>
              <Button disabled>{currResult + 1}</Button>
              <Button endIcon={<ArrowForwardIosIcon style={{ fontSize: '14px' }} />} onClick={onNextClick} disabled={systemObj.pipelineResult.length <= currResult + 1} >Next</Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mt: '5px', marginBottom: '10px' }} />
      {/* Result page - Top Container */}
      <Box sx={{ flex: 3, display:'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box sx={{ height: '30px' }}>
          <Typography variant='caption'>
            Visualization
            {
              // systemObj.pipelineResult.length > currResult && systemObj.pipelineResult[currResult].type !== "graph" &&
              systemObj.pipelineResult.length > currResult &&
              <IconButton aria-label="toggle editor" onClick={onDownloadClick} sx={{ mt: '-10px'}}>
                <LiaCloudDownloadAltSolid style={{ fontSize: "24px" }}/>
              </IconButton>
            }
          </Typography>
          <Typography variant="caption">
            {showFileName()}
          </Typography>
        </Box>
        {/* Result page - Visualization */}
        <Box sx={{ flex: 2, minHeight: 0, overflowY: 'auto', maxHeight: "90%" }}>
          {systemObj.pipelineResult.length > 0 ?
            createVisualization()
            :
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', color: '#929292' }}>
              <Typography variant='h6' sx={{ flex: 1, textAlign: 'center', color: '#929292' }}>
                No available visualizations
              </Typography>
            </Box>
          }
        </Box>
      </Box>
    </Box>
  )
}

export default ResultPage
