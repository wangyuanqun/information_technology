import { Box, TextField, Typography } from '@mui/material';
import React, { useCallback, useState, useEffect, useContext } from 'react';

// Component
const CuNumberField = ({sx, title, value, label, cbOnChanged}) => {

  const [numberValue, setNumberValue] = useState(value);

  const onChange = (evt) => {
    setNumberValue(evt.target.value);
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
          variant="outlined"
          type="number"
          value={numberValue}
          inputProps={{ min: 0 }}
          sx={{ flex: 5 }}
          onChange={onChange}
        />
     </Box>
  );
}

export default CuNumberField
