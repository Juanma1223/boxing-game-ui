import React, { useState, useEffect } from 'react';
import {
  Typography,
  Slider,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid2';
import { toast } from 'react-toastify';

function App() {
  const [speed, setSpeed] = useState(50);
  const [selectedCombination, setSelectedCombination] = useState(0);
  const [espIp, setEspIp] = useState("192.168.4.1");
  const [editOpen, setEditOpen] = useState(false);
  const [currentPunches, setCurrentPunches] = useState([]);
  const [combinations, setCombinations] = useState([
    { id: 0, label: 'Combinacion 1', value: [1, 2, 3] },
    { id: 1, label: 'Combinacion 2', value: [0, 2, 3] },
    { id: 2, label: 'Combinacion 3', value: [0, 1, 3] },
    { id: 3, label: 'Combinacion 4', value: [0, 1, 2] },
    { id: 4, label: 'Random', value: [] }
  ])

  const punches = ["Jab", "Recto", "Gancho I", "Gancho D"]

  // List of available combinations
  useEffect(() => {
    return () => {
    }
  }, [])


  // Handle selecting a combination
  const handleCombinationSelect = (id) => {
    setSelectedCombination(id);
    // Send selected combination to device
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors',
      body: JSON.stringify({ value: combinations[id].value })
    };
    try {
      fetch(`http://${espIp}/combination`, requestOptions);
    } catch {
      toast.error("Error al seleccionar una combinación!");
    }
  };

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors',
      body: JSON.stringify({ value: newValue })
    };
    try {
      fetch(`http://${espIp}/speed`, requestOptions);
    } catch {
      toast.error("Error al establecer la velocidad!");
    }
  };


  const idsToPunches = (ids) => {
    return ids.map((id, i) => punches[id] + (i < ids.length ? ", " : ""))
  }

  const handleEdit = () => {
    setEditOpen(true);
  }

  const handleClose = () => {
    setCurrentPunches([])
    setEditOpen(false);
  }

  const addPunch = (id) => {
    if (currentPunches.length < 9) {
      setCurrentPunches([...currentPunches, id]);
    }
  }

  const handleSavePunches = () => {
    combinations[selectedCombination].value = currentPunches;
    setCombinations(combinations);
    handleClose();
  }

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#121212', padding: 2 }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#2E3B4E', boxShadow: 'none', borderBottom: '1px solid #444' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#F5F5F5' }}>
            Configuración
          </Typography>
          <Button color="inherit" sx={{ color: '#F5F5F5' }}>Save</Button>
        </Toolbar>
      </AppBar>

      <Dialog
        open={editOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        color='secondary'
      >
        <DialogTitle id="alert-dialog-title">
          {"Editar combinacion"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid size={6}>
                <Button variant='outlined' color="success" onClick={() => addPunch(0)}><SportsMmaIcon />Jab</Button>
              </Grid>
              <Grid size={6}>
                <Button variant='outlined' color="success" onClick={() => addPunch(1)}>Recto<SportsMmaIcon /></Button>
              </Grid>
              <Grid size={6}>
                <Button variant='outlined' color="success" onClick={() => addPunch(2)}><SportsMmaIcon />Gancho I</Button>
              </Grid>
              <Grid size={6}>
                <Button variant='outlined' color="success" onClick={() => addPunch(3)}>Gancho D<SportsMmaIcon /></Button>
              </Grid>
            </Grid>
          </Box>
          <div style={{ paddingTop: "1rem", paddingBottom: "1rem" }}></div>
          {idsToPunches(currentPunches).map((currentPunch, i) => <Button>{i + 1}- {currentPunch}</Button>)}
        </DialogContent>
        <DialogActions>
          <Button color='success' onClick={handleClose}>Cancelar</Button>
          <Button color='success' onClick={handleSavePunches} autoFocus>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Combination Section */}
      <Box sx={{ color: '#E0E0E0', paddingTop: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>Elige una combinación</Typography>

        <List sx={{ backgroundColor: '#1A1A1A', borderRadius: '8px', marginTop: 2 }}>
          {combinations.map((combination) => (
            <ListItem
              key={combination.id}
              disablePadding
            >
              <ListItemButton
                selected={selectedCombination === combination.id}
                onClick={() => handleCombinationSelect(combination.id)}
                sx={{
                  color: '#E0E0E0',
                  '&.Mui-selected': {
                    backgroundColor: '#8BC34A',
                    color: '#000',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#8BC34A',
                    color: '#000',
                  },
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  borderRadius: '4px',
                  marginY: '4px',
                }}
              >
                <ListItemText
                  primary={combination.label}
                  secondary={idsToPunches(combination.value)}
                  primaryTypographyProps={{ fontWeight: selectedCombination === combination.id ? 'bold' : 'normal' }}
                  secondaryTypographyProps={{ color: 'white' }}
                />

                {combination.label != "Random" ? <IconButton color="success"><EditIcon onClick={handleEdit} /></IconButton> : <></>}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ marginY: 2, borderColor: '#333' }} />
      </Box>

      {/* Speed Slider */}
      <Box sx={{ color: '#E0E0E0', marginTop: 2 }}>
        <Typography variant="h6" sx={{ color: '#F5F5F5', fontWeight: 'medium' }}>Speed</Typography>
        <Slider
          value={speed}
          onChange={handleSpeedChange}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          sx={{
            color: '#8BC34A',
            width: '100%',
            marginTop: 2,
            '& .MuiSlider-thumb': { boxShadow: '0 0 8px rgba(0,0,0,0.2)' },
          }}
        />
      </Box>

      {/* Upload Button */}
      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#8BC34A',
            padding: 1.5,
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#8BC34A',
            },
          }}
        >
          Enviar al dispositivo
        </Button>
      </Box>
    </Box>
  );
}

export default App;
