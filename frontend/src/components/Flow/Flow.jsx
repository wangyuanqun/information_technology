import React, { useCallback, useState, useEffect, useContext, useRef, useImperativeHandle } from 'react';
// React Flow
import ReactFlow, { Controls, Background, applyEdgeChanges, applyNodeChanges, addEdge, useReactFlow, useNodesState, useEdgesState, useOnViewportChange } from 'reactflow';
import 'reactflow/dist/style.css';

import ExpandMenu from '../ExpandMenu';

import { initialNodes, initialEdges } from '../../data';

import CustomNode from '../CustomNode';

// React Flow const
// TODO: change to use Zustand https://reactflow.dev/docs/guides/state-management/
// TODO: add node https://reactflow.dev/docs/examples/interaction/drag-and-drop/

const edgeOptions = {
  type: "smoothstep",
  interactionWidth: 10,
  markerEnd: {
    type: 'arrow',
  }
};

const connectionLineStyle = { stroke: '#a2a2a2' };
let nodeId = 1;

const expandOptions = [
  'Source Node',
  'Processing Node',
  'Output Node'
];

const nodeTypes = { customNode: CustomNode };

// Flow
const Flow = React.forwardRef((props, ref) => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const viewportLayout = useRef({x:100, y: 120, zoom: 1.2});

  // React flow
  const [nodes, setNodes, onNodesChange] = useNodesState(props.layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.layoutedEdges);
  const yPos = useRef(0);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onSelectionChange = useCallback((nodes, edges) => {
    props.cbOnNodeSelected(nodes);
  }, []);

  const onMoveEnd = useCallback((evt, viewport) => {
    props.cbOnViewportChange(reactFlowInstance.toObject());
  });

  useEffect(() => {
    if (props.layoutedViewport !== null) {
      viewportLayout.current = props.layoutedViewport;
    }
    else {
      let DOMHeight = document.getElementsByClassName("react-flow__pane")[0].offsetHeight;
      const initYPos = DOMHeight / 2 - 20;
      viewportLayout.current = {x:100, y: initYPos, zoom: 1.2};
    }
  }, []);

  const onAddClick = (type) => {
    // find rightmost node
    let right_x = -170;
    let right_y = 0
    reactFlowInstance.getNodes().forEach((node) => {
      if (node.position.x > right_x) {
        right_x = node.position.x;
        right_y = node.position.y;
      }
    });

    const id = `${nodeId++}`;
    const newNode = {
      id,
      position: {
        x: right_x + 170,
        y: right_y
      },
      data: {},
    };
    if (type === 0) {
      newNode.type = 'customNode';
      newNode.data.label = "Source Node";
      newNode.data.type = "in";
    }
    else if (type === 1) {
      newNode.type = 'customNode';
      newNode.data.label = "Processing Node";
      newNode.data.type = "proc";
    }
    else if (type === 2) {
      newNode.type = 'customNode';
      newNode.data.label = "Output Node";
      newNode.data.type = "out";
    }

    reactFlowInstance.addNodes(newNode);
    props.cbOnNodeAdded(type, id);
  };

  const cbOnAddClick = (type) => {
    /* Type Definition:
      0: Input
      1: Process
      2: Output
    */
    onAddClick(type);
  };

  const onNodesDelete = (nodes) => {
    props.cbOnNodesDelete(nodes);
  };

  useEffect(() => {
    if (reactFlowInstance)
      props.cbOnNodesEdgesChanges(reactFlowInstance.toObject())
  }, [nodes, edges]);

  // InperativeHandle for catching action triggered in parent
  useImperativeHandle(ref, () => ({
    
    importPipeline(flowObj, nodeCount) {
      if (flowObj) {
        const { x = 0, y = 0, zoom = 1 } = flowObj.viewport;
        const nodes = flowObj.nodes || [];
        setNodes(nodes);
        setEdges(flowObj.edges || []);
        reactFlowInstance.setViewport({ x, y, zoom });
        nodeId = 0;
        for (let i = 0; i < nodes.length; i++) {
          if (parseInt(nodes[i].id) > nodeId)
            nodeId = parseInt(nodes[i].id);
        }
        nodeId++;
      }
    },

    exportPipeline() {
      return reactFlowInstance.toObject();
    },

    resetPipeline() {
      nodeId = 1;
      reactFlowInstance.setNodes(initialNodes);
      reactFlowInstance.setEdges(initialEdges);
      let DOMHeight = document.getElementsByClassName("react-flow__pane")[0].offsetHeight;
      const initYPos = DOMHeight / 2 - 20;
      reactFlowInstance.setViewport({x:100, y: initYPos, zoom: 1.2});
    },

    getNodes() {
      if (reactFlowInstance)
        return reactFlowInstance.getNodes();
      else
        return [];
    },

    getEdges() {
      if (reactFlowInstance)
        return reactFlowInstance.getEdges();
      else
        return [];
    },

    updateNodeValue(index, value) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id == index) {
            node.data = {
              ...node.data,
              value: value
            };
          }

          return node;
        })
      );
    }

  }));

  return (
    <div style={{ height: '100%' }}>
      <ExpandMenu
        options={expandOptions}
        style={{position: 'absolute', zIndex: '1', right: '0'}}
        cbOnAddClick={cbOnAddClick}/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        defaultEdgeOptions={edgeOptions}
        connectionLineStyle={connectionLineStyle}
        snapGrid={[10, 10]}
        snapToGrid
        defaultViewport={viewportLayout.current}
        style={{
          backgroundColor: '#eef0f5'
        }}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        onMoveEnd={onMoveEnd}
        onInit={setReactFlowInstance}
        multiSelectionKeyCode={null}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
})


export default Flow
