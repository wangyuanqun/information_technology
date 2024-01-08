import React, { useCallback, useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CuCheckBox = ({sx, title, value, cbOnChanged}) => {

  const [checked, setChecked] = useState(value);

  const onChanged = (evt) => {
    setChecked(evt.target.checked);
    if (cbOnChanged) cbOnChanged(evt.target.checked);
  }

  return (
     <Box sx={{height: '40px', display: 'flex', alignItems: 'center', pl: '10px', pr: '10px', ...sx}}>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={checked} onChange={onChanged} />} label={title} />
        </FormGroup>
     </Box>
  );
}

export default CuCheckBox
