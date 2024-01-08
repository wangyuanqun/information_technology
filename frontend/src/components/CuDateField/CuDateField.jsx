import React, { useCallback, useState, useEffect, useContext } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment';

const CuDateField = ({sx, title, value, cbOnChanged}) => {

  const momentObj = value === "" ? null : moment(value);
  const [dateValue, setDateValue] = useState(momentObj);

  const onChanged = (val) => {
    setDateValue(val);
    if (cbOnChanged) cbOnChanged(val.format("YYYYMMDD"));
  }

  return (
     <Box sx={{height: '70px', display: 'flex', alignItems: 'center', pl: '10px', pr: '10px', ...sx}}>
        <Typography variant="caption" sx={{ flex: 1, fontSize: '13pt' }}>
          {title}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker sx={{ flex: 5 }} value={dateValue} onChange={onChanged}/>
        </LocalizationProvider>
        
     </Box>
  );
}

export default CuDateField
