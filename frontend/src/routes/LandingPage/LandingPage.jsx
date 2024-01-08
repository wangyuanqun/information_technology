// TODO: remove showEditor

import React, { useCallback, useState, useEffect, useContext, useRef } from 'react';
import { Box, Button, CssBaseline, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { message } from 'antd';
import { UserContext } from '../../userContext';
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

// Component
import SplitButton from '../../components/SplitButton';
import CuTextField from '../../components/CuTextField';
import CuDateField from '../../components/CuDateField';
import CuSelectField from '../../components/CuSelectField';
import CuCheckBox from '../../components/CuCheckBox';
import CuNumberField from '../../components/CuNumberField';
import Flow from '../../components/Flow';

// Component: Code Mirror
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
// Component: React Flow
import { ReactFlowProvider } from 'reactflow';

// Icon
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SendIcon from '@mui/icons-material/Send';
import { TbSettingsCheck } from "react-icons/tb";
import { TbSettingsQuestion } from "react-icons/tb";
import { TbDragDrop } from "react-icons/tb";
import { CiImport } from "react-icons/ci";
import { HiOutlineDocumentSearch } from 'react-icons/hi';

// TODO: solve min width when browser resizing
// TODO: pass data from child to parent: useRef (https://medium.com/@bhuvan.gandhi/pass-data-from-child-component-to-parent-component-without-using-state-hook-b301a319b174)
// forceUpdate: https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate

import { stagesInfo as si, stagesData as sd, pipelineJSON as pJSON } from './stages-data';
import { nodeTypeToString, parsePipeline, fetchURL, readFileFromPath, parseJsonFile, BASEURL } from '../../helper';
import { LastPageRounded } from '@mui/icons-material';
import { initialNodes, initialEdges } from '../../data';

import styled, { ThemeProvider } from 'styled-components';

import { saveAs } from 'file-saver';
import ViewFileModal from '../../components/ViewFileModal';
import SplitButtonViewer from '../../components/SplitButtonViewer';

import "./LandingPage.css";

const drawerWidth = 240;

const reactFlowStyle = {
  bg: '#fff',
  primary: '#ff0072',

  nodeBg: '#f2f2f5',
  nodeColor: '#222',
  nodeBorder: '#222',

  minimapMaskBg: '#f2f2f5',

  controlsBg: '#fefefe',
  controlsBgHover: '#eee',
  controlsColor: '#222',
  controlsBorder: '#ddd',
};

const LandingPage = ({style}) => {

  const systemObj = useContext(UserContext);
  const navigate = useNavigate();

  // react flow
  const reactFlowRef = React.useRef();
  const [layoutedNodes, setLayoutedNodes] = React.useState(() => {
    // TODO: Parse the pipeline to the stagesData

    // const pipelineDict = parsePipeline();
    // layoutedNodes.current = pipelineDict.node;
    // layoutedEdges.current = pipelineDict.edge;
    // setStagesData(pipelineDict.data);

    if (systemObj.flowObject)
      return systemObj.flowObject.nodes;
    else
      return initialNodes;
  });

  const [layoutedEdges, setLayoutedEdges] = React.useState(() => {
    if (systemObj.flowObject)
      return systemObj.flowObject.edges;
    else
      return initialEdges;
  });

  const [layoutedViewport, setLayoutedViewport] = React.useState(() => {
    if (systemObj.flowObject) {
      return systemObj.flowObject.viewport;
    }
    else {
      return null;
    }
  });

  const lastFlowHash = React.useRef("");

  // other components
  const [showEditor, setShowEditor] = React.useState(false);
  const loadedDefaultMS = React.useRef(false);
  const [loadedMS, setLoadedMS] = React.useState(false);
  const [isRunningPipeline, setIsRunningPipeline] = React.useState(false);
  const [MSFile, setMSFile] = React.useState(false);
  const [stageIndex, setStageIndex] = React.useState(-1);
  const [messageApi, contextHolder] = message.useMessage();
  const [stagesInfo, setStagesInfo] = React.useState({});
  const [pipelineJSON, setPipelineJSON] = React.useState(pJSON);
  const [fileModalOpen, setFileModalOpen] = React.useState(false);
  const [msModalOpen, setMsModalOpen] = React.useState(false);
  const fileList = React.useRef([]);
  const microservicesList = React.useRef([]);

  useEffect(() => {
    if (!showEditor) {
      if (!loadedDefaultMS.current) {
        // TODO: parse the pipeline to the stagesData
        axios.get(`${BASEURL}/all_services`)
        .then(res => {
          const data = res.data;

          if (data.hasOwnProperty("status") && data.status !== "success") {
            // Do nothing
          }
          // API error
          else if (data.hasOwnProperty("detail")) {
            // Do nothing
          }
          else {
            setStagesInfo(data.data);
            setLoadedMS(true);
          }
        })
        loadedDefaultMS.current = true;
      }
    }
  }, [showEditor]);

  const createMessageDialog = (key, type, content, duration=2) => {
    messageApi.open({
      key: key,
      type: type,
      content: content,
      duration: duration,
      style: { position: 'relative', top: '60px' }
    });
  }
  
  const onImportFilesDone = async (file) => {
    if (file) {
      createMessageDialog("uploadFile", "loading", "Uploading...", 0);
      
      const formData = new FormData();
      formData.append("file", file);
      axios.post(`${BASEURL}/uploadfile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          createMessageDialog("uploadFile", "success", "Uploaded file");
        })
        .catch((error) => {
          const detail = error.response.data.detail;
          let msg = "";
          if (typeof detail === "string") 
            msg = detail;
          else if (Array.isArray(detail))
            msg = detail[0].msg;

          createMessageDialog("uploadFile", "error", `Error: ${msg}`);
        })
    }
  }

  const onImportMSDone = async (file) => {
    if (file) {
      createMessageDialog("uploadMS", "loading", "Loading...");

      const formData = new FormData();
      formData.append("file", file);
      axios.post(`${BASEURL}/uploadMS`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        createMessageDialog("uploadMS", "success", "Uploaded file");

        const data = response.data;

        if (data.hasOwnProperty("status") && data.status !== "success") {
          createMessageDialog("uploadMS", "error", `Error: ${data.message}`);
        }
        // API error
        else if (data.hasOwnProperty("detail")) {
          createMessageDialog("uploadMS", "error", `Error: ${data.detail}`);
        }
        else {
          createMessageDialog("uploadMS", "success", "Loaded microservices");

          // fetch microservices
          axios.get(`${BASEURL}/all_services`)
          .then(res => {
            const data = res.data;

            if (data.hasOwnProperty("status") && data.status !== "success") {
              // Do nothing
            }
            // API error
            else if (data.hasOwnProperty("detail")) {
              // Do nothing
            }
            else {
              setStagesInfo(data.data);
              setLoadedMS(true);
            }
          })  

          setLoadedMS(true);
        }
      })
      .catch((error) => {
        const detail = error.response.data.detail;
        let msg = "";
        if (typeof detail === "string") 
          msg = detail;
        else if (Array.isArray(detail))
          msg = detail[0].msg;

        createMessageDialog("uploadMS", "error", `Error: ${msg}`);
      })
    }
    // setLoadedMS(true);
  }

  const importPipeline = async (file) => {
    const data = await parseJsonFile(file);
    reactFlowRef.current.importPipeline(data.flowObj, data.stagesData.length);
    systemObj.setStagesData(data.stagesData);
  };

  const exportPipeline = () => {
    const flowObj = reactFlowRef.current.exportPipeline();
    const data = {
      flowObj: flowObj,
      stagesData: systemObj.stagesData
    };
    const blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "output.ple");
  };

  const resetPipeline = () => {
    reactFlowRef.current.resetPipeline();
    systemObj.stagesData.splice(0, systemObj.stagesData.length);
  };

  const cbOnPipelineClick = (index, value = null) => {
    if (index === 0)
      importPipeline(value);
    else if (index === 1)
      exportPipeline();
    else if (index === 2)
      resetPipeline();
  };

  // Flow related functions
  const cbOnNodeSelected = (selectionObj) => {
    // TODO: unselected will remain the same controls
    if (selectionObj.nodes.length === 0) {
      setStageIndex(-1);
    } else {
      setStageIndex(parseInt(selectionObj.nodes[0].id));
    }
  };

  const cbOnNodeAdded = (type, id) => {

    const createNode = () => {
      const node = {
        nodeid: parseInt(id),
        serviceid: -1,
        type: nodeTypeToString(type),
        params: {}
      }

      return node;
    };

    systemObj.stagesData.push(createNode());
  };

  const cbOnNodesDelete = (nodes) => {
    if (nodes.length === 0)
      return;

    const nodeid = parseInt(nodes[0].id);
    systemObj.stagesData.splice(0,
      systemObj.stagesData.length,
      ...systemObj.stagesData.filter(stage => stage.nodeid !== nodeid, nodeid));

    console.log(systemObj.stagesData);
  }

  const cbOnNodesEdgesChanges = (flowObj) => {
    systemObj.setFlowObject(flowObj);
  }

  const cbOnViewportChange = (flowObj) => {
    systemObj.setFlowObject(flowObj);
  }

  const onRunClick = () => {
    // TODO: skip run if there is no input
    // TODO: skip run if the pipeline is multiple pipeline

    // console.log('stagesData:');
    // console.log(stagesData);
    // console.log('stagesInfo:');
    // console.log(stagesInfo);
    // console.log('reactFlowRef:');
    // console.log(reactFlowRef.current.exportPipeline());
    
    let errorMsg = "";
    const setupHash = () => {
      const flowObj = reactFlowRef.current.exportPipeline();
      const edgeHash = {};
      flowObj.edges.forEach(edge => {
        if (edgeHash.hasOwnProperty(edge.target))
          edgeHash[edge.target].push(`n${edge.source}`);
        else
          edgeHash[edge.target] = [`n${edge.source}`];
      });
      return edgeHash;
    };

    const setupData = () => {
      const edgeHash = setupHash();
      const data = [];

      // TODO: validate if any paramerter is missing
      // TODO: pop error and stop the run pipeline when user hasn't setup the parameters

      const outputFileList = [];
      systemObj.stagesData.forEach(stage => {
        if (stage.serviceid === -1) {
          errorMsg = "Stage is not setup";
        }
        else {
          const stageInfo = stagesInfo[stage.type].filter(item => item.id === stage.serviceid)[0];
          const inputs = edgeHash.hasOwnProperty(stage.nodeid) ? edgeHash[stage.nodeid] : [];
          const stageParamsSorted = Object.keys(stage.params).sort().reduce((o, key) => ({...o, [key]: stage.params[key]}), {})
          const params = Object.keys(stageParamsSorted).map(key => {
            if (stage.params[key].displayname.search("Output") !== -1)
              outputFileList.push(stage.params[key].value.toLowerCase());
            return stage.params[key].value
          });
          const stageData = {
            "ID": `n${stage.nodeid}`,
            "module_function": stageInfo.fnname,
            "inputs": inputs,
            "params": params
          };
          data.push(stageData);
        }
      });
      return {data, outputFileList};
    }

    let {data, outputFileList} = setupData();

    if (new Set(outputFileList).size !== outputFileList.length) {
      createMessageDialog("runPipeline", "error", "Output file names can't be the same", 3);
      return;
    }

    if (errorMsg !== "") {
      createMessageDialog("runPipeline", "error", errorMsg, 3);
      return;
    }

    setIsRunningPipeline(true);
    createMessageDialog("runPipeline", "loading", "Running Pipeline...", 0);


    axios.post(`${BASEURL}/pipeline`, data)
    .then((response) => {
      if (response.data && response.data.status === "success") {
        const folder = response.data.data;
        // setup result to the system cache
        axios.get(`${BASEURL}/get_generations?folder=${folder}`)
        .then((response) => {
          if (response.data && response.data.status === "success") {
            
            const parseFiles = (data) => {
              const visFiles = [];
              const downloadFiles = [];
              
              data.forEach(item => {
                const ext = item.split('.').pop();
                if (item.search(/\.html$/i) !== -1) {
                  visFiles.push({
                    "type": "graph",
                    "folder": folder,
                    "src": item,
                    "ext": ext
                  }); 
                }
                else if (item.search(/\.png|\.jpg|\.jpeg/i) !== -1) {
                  visFiles.push({
                    "type": "image",
                    "folder": folder,
                    "src": item,
                    "ext": ext
                  }); 
                }
                else {
                  downloadFiles.push({
                    "folder": folder,
                    "src": item,
                    "ext": ext
                  }); 
                }
              });
              return {
                "visFiles": visFiles,
                "downloadFiles": downloadFiles
              };
            }

            // const temp = [
            //   "graph.png",
            //   "newplot.png",
            //   "plotly_graph.html"
            // ];
            systemObj.hasRunPipeline.current = true;
            const result = parseFiles(response.data.data);
            systemObj.setPipelineResult(result.visFiles);
            systemObj.setPipelineAvailableFiles(result.downloadFiles);

            systemObj.popupMsg.current = "Pipeline execute successfully";
            navigate("/result"); 
          }
        })
      }
      else {
        const msg = response.data.data["function_name"] + ": " + response.data.data.traceback;
        createMessageDialog("runPipeline", "error", `Pipeline execute failed: ${msg}`, 7);
      }

      setIsRunningPipeline(false);
    })
    .catch((error) => {
      let msg = "";
      if (error.hasOwnProperty("response")) {
        const detail = error.response.data.detail;
        if (typeof detail === "string") 
          msg = detail;
        else if (Array.isArray(detail))
          msg = detail[0].msg;
      }
      else {
        msg = "Unknown error";
      }

      createMessageDialog("runPipeline", "error", `Pipeline execute failed: ${msg}`);
      setIsRunningPipeline(false);
    })
  };

  // generate stage controls
  const createStageControl = (stageInfo, stageData) => {

    const updateStageDataParameter = (stageData, pid, value, displayname, type) => {
      const key = `pid-${pid}`;
      // parse list type
      const dictValue = {
        displayname: displayname
      };
      if (type === "list") {
        try {
          const tmpList = JSON.parse(value.trim());
          const resultList = [];
          if (tmpList.length > 0) {
            const firstEleType = typeof(tmpList[0]);
            if (firstEleType !== "number") {
              tmpList.forEach(item => {
                resultList.push(String(item));
              });
            }
            else {
              tmpList.forEach(item => {
                resultList.push(item);
              });
            }
          }
          dictValue["value"] = resultList;
          stageData.params[key] = dictValue;
        }
        catch {
          // user dones't pass a list, we try to parse it
          try {
            const tmpList = value.trim().split(/[\s]*,+[\s]*/);
            dictValue["value"] = tmpList;
            stageData.params[key] = dictValue;
          }
          catch {
            dictValue["value"] = value;
            stageData.params[key] = dictValue;
          }
        }
      }
      else if (type === "int" || type === "float") {
        dictValue["value"] = Number(value);
        stageData.params[key] = dictValue;
      }
      else
      dictValue["value"] = value;
        stageData.params[key] = dictValue;
    };
    

    const group_obj = {si: stageInfo, sd: stageData};
    return <>
      {
        stageInfo &&
        stageInfo.hasOwnProperty("params") && 
        stageInfo.params.map((param, idx) => {
          const default_value = param.type == "bool" ? true : "";
          // TODO: get fnname if doesn't provide display
          let value = group_obj.sd.params.hasOwnProperty(`pid-${param.pid}`) ? group_obj.sd.params[`pid-${param.pid}`].value : default_value;
          if (param.type === "list" && value.length > 0 && value[0].length !== 0)
            value = JSON.stringify(value);
          
          if (param.type === "int")
            return <CuNumberField key={`${group_obj.sd.nodeid}-${idx}-${param.displayname}`}
                    title={param.displayname}
                    value={value}
                    label={param.type}
                    cbOnChanged={(val) => {updateStageDataParameter(group_obj.sd, param.pid, val, param.displayname, param.type)}}
                  />;
          else if (param.type === "Date")
            return <CuDateField key={`${group_obj.sd.nodeid}-${idx}-${param.displayname}`}
                    title={param.displayname}
                    value={value}
                    cbOnChanged={(val) => {updateStageDataParameter(group_obj.sd, param.pid, val, param.displayname, param.type)}}
                  />;
          else if (param.type === "Selection")
            return <CuSelectField key={`${group_obj.sd.nodeid}-${idx}-${param.displayname}`}
                    title={param.displayname}
                    value={value}
                    options={param.options}
                    cbOnSelectionChanged={(val, title) => {updateStageDataParameter(group_obj.sd, param.pid, val, param.displayname, param.type)}}
                  />;
          else if (param.type === "bool")
            return <CuCheckBox key={`${group_obj.sd.nodeid}-${idx}-${param.displayname}`}
                    title={param.displayname}
                    value={value}
                    cbOnChanged={(val) => {updateStageDataParameter(group_obj.sd, param.pid, val, param.displayname, param.type)}}
                  />;
          else 
            return <CuTextField key={`${group_obj.sd.nodeid}-${idx}-${param.displayname}`}
                    title={param.displayname}
                    value={value}
                    label={param.type}
                    cbOnChanged={(val) => {updateStageDataParameter(group_obj.sd, param.pid, val, param.displayname, param.type)}}
                  />;
        }, group_obj)
      }
    </>
  };

  const createStageControls = () => {
    
    const updateStageServiceId = (serviceid, title) => {
      const stages = systemObj.stagesData.filter(item => item.nodeid === stageIndex);
      if (stages.length == 0)
        return;
      const stage = stages[0];
      stage.serviceid = serviceid;
      stage.params = {};
      systemObj.setStagesData([...systemObj.stagesData]);
      reactFlowRef.current.updateNodeValue(stageIndex, title);
    };


    const stages = systemObj.stagesData.filter(item => item.nodeid === stageIndex);
    if (stages.length === 0) {
      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ flex: 1, textAlign: 'center', color: '#929292' }}>
            Please select a stage
          </Typography>
        </Box>
      )
    }
    else {
      const stage = stages[0];
      const stageType = stage["type"];
      if (stagesInfo.hasOwnProperty(stageType) === false) {
        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ flex: 1, textAlign: 'center', color: '#929292' }}>
              Please import a microservice file
            </Typography>
          </Box>
        )
      }

      const stageInfo = stagesInfo[stageType].filter(item => item.id === stage.serviceid)[0];
      if (stageType === "in") {
        // TODO: use fnname if display doesn't exist
        const inputOptions = stagesInfo[stageType].map(item => {return { 'title': item.display, 'value': item.id}});
        const value = stage.serviceid === -1 ? "" : stage.serviceid;
        return (
          <Box>
            <CuSelectField key={`Source-${stage['nodeid']}`} title="Source" value={value} options={inputOptions} cbOnSelectionChanged={(val, title) => updateStageServiceId(val, title)} />
            {stage.serviceid > 0 ? createStageControl(stageInfo, stage): <></>}
          </Box>
        )
      }
      else if (stageType === "proc") {
        const inputOptions = stagesInfo[stageType].map(item => {return { 'title': item.display, 'value': item.id}});
        const value = stage.serviceid === -1 ? "" : stage.serviceid;
        return (
          <Box>
            <CuSelectField key={`Action-${stage['nodeid']}`} title="Action" value={value} options={inputOptions} cbOnSelectionChanged={(val, title) => updateStageServiceId(val, title)} />
            {stage.serviceid > 0 ? createStageControl(stageInfo, stage): <></>}
          </Box>
        )
      }
      else if (stageType === "out") {
        // TODO: use fnname if display doesn't exist
        const outputOptions = stagesInfo[stageType].map(item => {return { 'title': item.display, 'value': item.id}});
        const value = stage.serviceid === -1 ? "" : stage.serviceid;
        // Fix CuSelectField reuse issue
        return (
        <Box>
          <CuSelectField key={`View-${stage['nodeid']}`} title="View Mode" value={value} options={outputOptions} cbOnSelectionChanged={(val, title) => updateStageServiceId(val, title)} />
          {stage.serviceid > 0 ? createStageControl(stageInfo, stage): <></>}
        </Box>
        )
      }
    }
  }

  const showUploadedFiles = () => {
    axios.get(`${BASEURL}/csv_information`)
    .then(res => {
      const data = res.data;
      if (data.status === "success")
      {
        fileList.current = [];
        data.data.forEach(item => {
          // console.log(item);
          fileList.current.push({
            name: item.filename,
            size: item.size
          });
        });
        setFileModalOpen(true);
      }
    })
    .catch(error => {
      console.log("Fetched error")
    });
  }

  const deleteAllUploadedFiles = () => {
    axios.delete(`${BASEURL}/delete_csv`)
    .then((response) => {
      createMessageDialog("deleteFiles", "success", "Delete files successfully");
    })
    .catch((error) => {
      const detail = error.response.data.detail;
      let msg = "";
      if (typeof detail === "string") 
        msg = detail;
      else if (Array.isArray(detail))
        msg = detail[0].msg;

      createMessageDialog("deleteFiles", "error", `Error: ${msg}`);

      // need to reset pipeline as dependency issue
      resetPipeline();
    })
  }

  const showMSFiles = () => {
    axios.get(`${BASEURL}/service_information`)
    .then(res => {
      const data = res.data;
      if (data.status === "success")
      {
        microservicesList.current = [];
        data.data.forEach(item => {
          // console.log(item);
          microservicesList.current.push({
            name: item.filename,
            size: item.size
          });
        });
        setMsModalOpen(true);
      }
    })
    .catch(error => {
      console.log("Fetched error")
    });
  }

  const deleteAllMSFiles = () => {
    axios.delete(`${BASEURL}/delete_service`)
    .then((response) => {
      createMessageDialog("deleteServices", "success", "Delete Microservice files successfully");
      axios.get(`${BASEURL}/all_services`)
        .then(res => {
          const data = res.data;

          if (data.hasOwnProperty("status") && data.status !== "success") {
            // Do nothing
          }
          // API error
          else if (data.hasOwnProperty("detail")) {
            // Do nothing
          }
          else {
            setStagesInfo(data.data);
            setLoadedMS(true);
          }
        })
    })
    .catch((error) => {
      const detail = error.response.data.detail;
      let msg = "";
      if (typeof detail === "string") 
        msg = detail;
      else if (Array.isArray(detail))
        msg = detail[0].msg;

      createMessageDialog("deleteServices", "error", `Error: ${msg}`);
    })
  }
  
  // code mirror
  const [value, setValue] = React.useState(JSON.stringify(pipelineJSON, null, 2));
  const onCodeChange = React.useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);

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
                Microservices
              </Typography>
            </Box>
            <Box>
              <Typography variant='h6' sx={{ fontSize: '12pt', fontWeight: 300, color: 'grey' }}>
                Choose your source and define your unique pipeline
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 3, alignItems: "center", justifyContent: 'right', display: 'inherit'}}>
            <SplitButtonViewer 
              title="Upload file"
              fileType=".csv"
              cbOnImportFileDone={onImportFilesDone}
              cbOnShowFiles={showUploadedFiles}
            >
              <ViewFileModal 
                title="Uploaded Files"
                open={fileModalOpen}
                fileList={fileList.current}
                cbOnClose={() => {
                  setFileModalOpen(false)
                }}
                cbDeleteFiles={deleteAllUploadedFiles}
              />
            </SplitButtonViewer>
          </Box>
          <Box sx={{ flex: 4, alignItems: "center", justifyContent: 'right', display: 'inherit', ml: '8px' }}>
            <SplitButtonViewer 
              title="Import Microservices"
              fileType=".py"
              cbOnImportFileDone={onImportMSDone}
              cbOnShowFiles={showMSFiles}
            >
              <ViewFileModal 
                title="Microservices Files"
                open={msModalOpen}
                fileList={microservicesList.current}
                cbOnClose={() => {
                  setMsModalOpen(false)
                }}
                cbDeleteFiles={deleteAllMSFiles}
              />
            </SplitButtonViewer>
          </Box>
          <Box sx={{ flex: 3, alignItems: "center", justifyContent: 'right', display: 'inherit', ml: '8px' }}>
            <SplitButton
              cbOnClick={cbOnPipelineClick}
            />
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mt: '5px', marginBottom: '10px' }} />
      {/* Pipeline Design - Top Container */}
      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant='caption'>
          Pipeline Design
        </Typography>
        <Box sx={{ flex: 1 }}>
          <ThemeProvider theme={reactFlowStyle}>
            <ReactFlowProvider>
              <Flow
                ref={reactFlowRef}
                cbOnNodeSelected={cbOnNodeSelected}
                cbOnNodeAdded={cbOnNodeAdded}
                cbOnNodesDelete={cbOnNodesDelete}
                cbOnNodesEdgesChanges={cbOnNodesEdgesChanges}
                cbOnViewportChange={cbOnViewportChange}
                layoutedNodes={layoutedNodes}
                layoutedEdges={layoutedEdges}
                layoutedViewport={layoutedViewport}
              />
            </ReactFlowProvider>
          </ThemeProvider>
        </Box>
      </Box>
      {/* Pipeline Design - Top Container */}
      <Box sx={{ flex: 3, display:'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box sx={{ height: '30px' }}>
          <Typography variant='caption'>
            Stage Property {showEditor ? "(Editor)" : "(Interactive)"}
            {/* <IconButton aria-label="toggle editor" onClick={() => setShowEditor(!showEditor)}>
              { showEditor ? <TbDragDrop style={{ fontSize: '16px' }} /> : <BorderColorIcon sx={{ fontSize: '16px' }} /> }
            </IconButton> */}
          </Typography>
        </Box>
        {/* Pipeline Design - Code Editing Mode */}
      {showEditor ? 
        <Box sx={{ flex: 2, minHeight: 0, display:'flex', flexDirection: 'column', height: "100%" }}>
          <CodeMirror
            style={{ flex: 1, height: "100%"}}
            height="100%"
            value={value}
            theme={okaidia}
            extensions={[json()]}
            onChange={onCodeChange}           
          />
        </Box>
        :
        <Box sx={{ flex: 2, minHeight: 0, overflowY: 'auto', backgroundColor: '#eef0f5' }}>
          {/* Stage properties go here */}
          {
            createStageControls()
          }
        </Box>
      }
      </Box>
        <Box sx={{ height: '75px' }}>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mt: '10px', mb: '20px' }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={onRunClick}
            // disabled={isRunningPipeline}
          >
            Run Pipeline
          </Button>
        </Grid>
        </Box>
    </Box>
  );
}

export default LandingPage
