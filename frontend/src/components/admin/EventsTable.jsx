import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  Box,
  TableSortLabel
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const EventsTable = ({ events, onViewClick, onEditClick, onDeleteClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('startDate');
  const [order, setOrder] = useState('desc');

  // Helper functions
  const getStatusColor = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (now.isBefore(start)) return 'primary';
    if (now.isAfter(start) && now.isBefore(end)) return 'success';
    return 'default';
  };

  const getStatusText = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (now.isBefore(start)) return 'Upcoming';
    if (now.isAfter(start) && now.isBefore(end)) return 'Ongoing';
    return 'Past';
  };

  const formatDate = (date) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort function
  const sortedEvents = React.useMemo(() => {
    const comparator = (a, b) => {
      let valueA, valueB;
      
      if (orderBy === 'title' || orderBy === 'location') {
        valueA = a[orderBy].toLowerCase();
        valueB = b[orderBy].toLowerCase();
      } else if (orderBy === 'price') {
        valueA = parseFloat(a[orderBy]);
        valueB = parseFloat(b[orderBy]);
      } else {
        valueA = dayjs(a[orderBy]);
        valueB = dayjs(b[orderBy]);
      }
      
      if (order === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
    };
    
    return [...events].sort(comparator);
  }, [events, order, orderBy]);

  // Pagination
  const paginatedEvents = sortedEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.paper' }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleRequestSort('title')}
                >
                  Event
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'startDate'}
                  direction={orderBy === 'startDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('startDate')}
                >
                  Dates
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={orderBy === 'location' ? order : 'asc'}
                  onClick={() => handleRequestSort('location')}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                      {event.description.length > 60
                        ? `${event.description.substring(0, 60)}...`
                        : event.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    {event.time && (
                      <Typography variant="body2" color="text.secondary">
                        {event.time}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(event.startDate, event.endDate)}
                      color={getStatusColor(event.startDate, event.endDate)}
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View details">
                      <IconButton
                        color="info"
                        onClick={() => onViewClick(event)}
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit event">
                      <IconButton
                        color="primary"
                        onClick={() => onEditClick(event)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete event">
                      <IconButton
                        color="error"
                        onClick={() => onDeleteClick(event)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No events found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {events.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default EventsTable;