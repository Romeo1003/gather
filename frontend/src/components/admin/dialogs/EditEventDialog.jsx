import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Grid,
  LinearProgress,
  Typography,
  styled
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Styled component for drop zone
const DropZone = styled('div')(({ theme, isdragactive }) => ({
  border: `2px dashed ${isdragactive === 'true' ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: isdragactive === 'true' ? theme.palette.action.hover : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(2),
}));

const EditEventDialog = ({ open, event, onClose, onSave }) => {
  const [currentEvent, setCurrentEvent] = useState({ ...event });
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (event) {
      setCurrentEvent({ ...event });
      setPreviewImage(event.image || null);
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // File upload handlers
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleSave = () => {
    // Validate dates
    if (new Date(currentEvent.endDate) < new Date(currentEvent.startDate)) {
      alert('End date must be after start date');
      return;
    }
    
    setUploading(true);
    onSave(currentEvent, selectedFile);
  };

  // Image upload section component
  const renderImageUploadSection = () => (
    <>
      <DropZone
        isdragactive={isDragActive.toString()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('edit-file-input').click()}
      >
        {previewImage ? (
          <>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '4px',
                marginBottom: '16px'
              }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              startIcon={<DeleteIcon />}
            >
              Remove Image
            </Button>
          </>
        ) : (
          <>
            <UploadIcon fontSize="large" color="action" />
            <Typography variant="body1" gutterBottom>
              Drag & drop an image here, or click to select
            </Typography>
            <Typography variant="caption" color="textSecondary">
              (Supports JPG, PNG up to 5MB)
            </Typography>
          </>
        )}
        <input
          id="edit-file-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </DropZone>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption">{uploadProgress}%</Typography>
        </Box>
      )}
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Event
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {renderImageUploadSection()}
          <TextField
            label="Title"
            fullWidth
            name="title"
            value={currentEvent?.title || ''}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={currentEvent?.description || ''}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                fullWidth
                name="startDate"
                type="date"
                value={currentEvent?.startDate || ''}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                fullWidth
                name="endDate"
                type="date"
                value={currentEvent?.endDate || ''}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
          <TextField
            label="Time"
            fullWidth
            name="time"
            value={currentEvent?.time || ''}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Location"
            fullWidth
            name="location"
            value={currentEvent?.location || ''}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Price"
            fullWidth
            name="price"
            type="number"
            value={currentEvent?.price || 0}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={uploading || !currentEvent?.title || !currentEvent?.description || !currentEvent?.location}
        >
          {uploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventDialog;