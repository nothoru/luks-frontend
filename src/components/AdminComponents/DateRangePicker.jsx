// src/components/AdminComponents/DateRangePicker.jsx
import React, { useState } from 'react';
import { Box, Button, Popover, Stack, List, ListItem, ListItemButton, Divider } from '@mui/material';
import { DateRange } from 'react-date-range';
import { addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DateRangePicker = ({ onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState([
    {
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onDateChange(state[0].startDate, state[0].endDate);
  };

  const open = Boolean(anchorEl);

  const presetRanges = [
    {
      label: 'Today',
      range: () => ({ startDate: new Date(), endDate: new Date() }),
    },
    {
      label: 'Yesterday',
      range: () => ({ startDate: subDays(new Date(), 1), endDate: subDays(new Date(), 1) }),
    },
    {
      label: 'This Week',
      range: () => ({ startDate: startOfWeek(new Date()), endDate: endOfWeek(new Date()) }),
    },
    {
      label: 'Last 7 Days',
      range: () => ({ startDate: subDays(new Date(), 7), endDate: new Date() }),
    },
    {
      label: 'This Month',
      range: () => ({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) }),
    },
    {
      label: 'Last Month',
      range: () => ({
        startDate: startOfMonth(subDays(new Date(), new Date().getDate())),
        endDate: endOfMonth(subDays(new Date(), new Date().getDate())),
      }),
    },
  ];

  const handlePresetClick = (rangeFunc) => {
    const newRange = rangeFunc();
    setState([{ ...newRange, key: 'selection' }]);
    onDateChange(newRange.startDate, newRange.endDate);
    setAnchorEl(null); 
  };

  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        startIcon={<CalendarMonthIcon />}
        sx={{ textTransform: 'none', color: 'text.primary', borderColor: 'grey.400' }}
      >
        {`${formatDate(state[0].startDate)} - ${formatDate(state[0].endDate)}`}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack direction="row">
          <List sx={{ p: 1, borderRight: '1px solid', borderColor: 'divider' }}>
            {presetRanges.map(({ label, range }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton onClick={() => handlePresetClick(range)}>
                  {label}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            direction="vertical"
          />
        </Stack>
      </Popover>
    </>
  );
};

export default DateRangePicker;