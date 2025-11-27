import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(url, {
        ...options,
        withCredentials: true
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar los datos');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}