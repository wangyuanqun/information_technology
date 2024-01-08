import { Box, TextField, Typography } from '@mui/material';
import React, { useCallback, useState, useEffect, useContext } from 'react';

// Component
const CuTextField = ({sx, title, value, label, cbOnChanged}) => {

  const [textValue, setTextValue] = React.useState(value);

  const onChange = (evt) => {
    setTextValue(evt.target.value);
    if (cbOnChanged) cbOnChanged(evt.target.value);
  }

  return (
     <Box sx={{height: '70px', display: 'flex', alignItems: 'center', pl: '10px', pr: '10px', ...sx}}>
        <Typography variant="caption" sx={{ flex: 1, fontSize: '13pt' }}>
          {title}
        </Typography>
        <TextField
          id="outlined-basic"
          label={label}
          value={textValue}
          variant="outlined"
          sx={{ flex: 5 }}
          onChange={onChange}
        />
     </Box>
  );
}

export default CuTextField
