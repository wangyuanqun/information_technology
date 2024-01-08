export const BASEURL = "http://127.0.0.1:5005"

export const nodeTypeToString = (type) => {
    const type_int = parseInt(type);
    if (type_int === 0)
        return "in";
    else if (type_int === 1)
        return "proc";
    else if (type_int === 2)
        return "out";
    return "undefined";
}

export const stringToNodeType = (value) => {
    if (value === "in")
        return 0;
    else if (value === "proc")
        return 1;
    else if (value === "out")
        return 2;
    return -1;
}

export const parsePipeline = (pipeline = []) => {
    const pipeline_nodes = [];
    for (const node of pipeline) {
        const parsedNode = {
            id: node.id,
            type: nodeTypeToString(node.type),
            position: {
                x: node.position.x,
                y: node.position.y
            },
            data: {
                label: node.data.label
            }
        }
        if (node.type === 0) {
            parsedNode.sourcePosition = 'right';
        }
        else if (node.type === 1) {
            parsedNode.sourcePosition = 'right';
            parsedNode.targetPosition = 'left';
        }
        else if (node.type === 2) {
            parsedNode.targetPosition = 'left';
        }
        pipeline_nodes.push(parsedNode);
    }

    const pipeline_edges = [];

    const pipeline_data = [];

    return {
        node: pipeline_nodes,
        edge: pipeline_edges,
        data: pipeline_data
    };
}


// helper functions
export async function readFileFromPath (file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(event.target.result)
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}

export async function parseJsonFile (file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => resolve(JSON.parse(event.target.result))
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
}

// Server connection
const serverURL = 'http://localhost:5005/'
export async function fetchURL(API, method, body = {}) {
    const options = {
        method,
        headers: {
          'Content-type': 'application/json',
        }
      };
    
      if (method !== 'GET') {
        options.body = JSON.stringify(body);
      }
    
      let res = await fetch(serverURL + API, options);
      res = await res.json();
      return res;
}
