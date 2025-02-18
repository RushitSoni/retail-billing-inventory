import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setText, setLoading, setError } from './Redux/Slices/temp';
import axios from 'axios';

const App = () => {
  const dispatch = useDispatch();
  const { text, isLoading, error } = useSelector((state) => state.temp);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get('http://localhost:8000'); 
        console.log(response)
        dispatch(setText(response.data));
      } catch (err) {
        dispatch(setError('Failed to fetch data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <div className="App">
      <h1>Welcome to the MERN Stack with Redux Toolkit</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {text && <p>{text}</p>}
     
    
    </div>
  );
};

export default App;
