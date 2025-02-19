import React, { useState } from 'react';
import NavBar from './Components/NavBar/NavBar';


const App = () => {
 
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
};

export default App;
