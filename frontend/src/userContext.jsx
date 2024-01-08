import React from "react";
import PropTypes from 'prop-types';

import { stagesData as sd } from './routes/LandingPage/stages-data';

export const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
    const [name, setName] = React.useState({});
    const [flowObject, setFlowObject] = React.useState(null);
    const [pipelineResult, setPipelineResult] = React.useState([]);
    const [pipelineAvailableFiles, setPipelineAvailableFiles] = React.useState([]);
    const [stagesData, setStagesData] = React.useState(sd);
    const hasRunPipeline = React.useRef(false);
    const popupMsg = React.useRef("");

    return (
        <UserContext.Provider value={({ name,
                                        setName,
                                        flowObject,
                                        setFlowObject,
                                        pipelineResult,
                                        setPipelineResult,
                                        popupMsg,
                                        hasRunPipeline,
                                        pipelineAvailableFiles,
                                        setPipelineAvailableFiles,
                                        stagesData,
                                        setStagesData
                                    })}
        >
            {children}
        </UserContext.Provider>
    )
};

UserContextProvider.propTypes = {
    children: PropTypes.node
  };
  