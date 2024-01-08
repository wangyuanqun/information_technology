import { Box, Typography } from '@mui/material';
import { useCallback } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import styled from 'styled-components';

const Node = styled.div`
  width: 150px;
  height: 40px;
  border-radius: 5px;
  background: white;
  color: ${(props) => props.theme.nodeColor};
  border: 1px solid ${(props) => (props.selected ? props.theme.primary : props.theme.nodeBorder)};

  .react-flow__handle {
    background: ${(props) => props.theme.primary};
    width: 8px;
    height: 8px;
    border-radius: 15px;
  }
`;

const CustomNode = ({data, selected, isConnectable}) => {
  const title = data.type === "in" ? "Source" : data.type === "proc" ? "Processing" : "Output";
  const value = data.value ? data.value : "-";

  return (
    <Node selected={selected} className="text-updater-node" >
      {(data.type === "proc" || data.type === "out") &&
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      }
      <Typography variant='caption' htmlFor="text" sx={{ position: 'absolute', left: 5, top: 1, fontSize: '9px', color: 'grey'}} >{title}</Typography><br/>
      <Box sx={{
        textAlign: 'center',
        position: 'relative',
        top: -13,
        pl: '6px',
        pr: '6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        <Typography variant='caption' htmlFor="text">{value}</Typography>  
      </Box>
      
      {(data.type === "in" || data.type === "proc") &&
        <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      }
    </Node>
  );
}

export default CustomNode
