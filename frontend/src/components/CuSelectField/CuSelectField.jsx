import React, { useCallback, useState, useEffect, useContext, useRef } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Box, FormControl, Typography } from '@mui/material';

// Component
const CuSelectField = ({sx, title, value, options, cbOnSelectionChanged}) => {

  const [selectedValue, setSelectedValue] = React.useState(value)

  const handleChange = (event, options) => {
    setSelectedValue(event.target.value);
    const title = options.filter(item => item.value == event.target.value)[0].title
    if (cbOnSelectionChanged) cbOnSelectionChanged(event.target.value, title);
  }

  return (
     <Box sx={{height: '70px', display: 'flex', alignItems: 'center', pl: '10px', pr: '10px', ...sx}}>
        <Typography variant="caption" sx={{ flex: 1, fontSize: '13pt' }}>
          {title}
        </Typography>
        <FormControl fullWidth sx={{ flex: 5 }}>
          <InputLabel>Value</InputLabel>
          <Select
            label={title}
            value={selectedValue}
            onChange={evt => handleChange(evt, options)}
          >
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.value}>{option.title}</MenuItem>
            )}
          </Select>
        </FormControl>
     </Box>
  );
}

export default CuSelectField
