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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';

function App() {
  const [speed, setSpeed] = useState(50);
  const [selectedCombination, setSelectedCombination] = useState(0);
  const [espIp, setEspIp] = useState("");

  const punches = ["Jab", "Recto", "Gancho I", "Gancho D"]

  // List of available combinations
  const combinations = [
    { id: 0, label: '1-2-3', value: [1, 2, 3] },
    { id: 1, label: '1-2-5', value: [0, 2, 3] },
    { id: 2, label: '2-3-4', value: [0, 1, 3] },
    { id: 3, label: '3-4-5', value: [0, 1, 2] },
    { id: 4, label: 'Random', value: [] }
  ];

  useEffect(() => {
    searchDevice();
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
      body: JSON.stringify({ value: combinations[id].value })
    };
    try {
      fetch('http://192.168.1.34/combination', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
    } catch {
      toast.error("Error al seleccionar una combinación!");
    }
  };

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: newValue })
    };
    try {
      fetch(`http://${espIp}/speed`, requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
    } catch {
      toast.error("Error al establecer la velocidad!");
    }
  };

  const searchDevice = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    for (let i = 0; i < 256; i++) {
      try {
        fetch(`http://192.168.1.${i}/check`, requestOptions)
          .then(response => response.json())
          .then(data => this.setState({ postId: data.id }));

        // If it succeds, set esp32 ip
        setEspIp(`192.168.1.${i}`)
        return
      } catch {
        toast.error("Error al establecer la velocidad!");
      }
    }
  }

  const idsToPunches = (ids) => {
    return ids.map((i, id) => punches[id] + (i < ids.length ? ", " : ""))
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
            width: '80%',
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
