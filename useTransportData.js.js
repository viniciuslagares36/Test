import { useState, useEffect } from 'react';
import axios from 'axios';

// Dados mockados simulando uma API GTFS-Realtime
const mockTransportData = {
  busLines: [
    { id: '110.1', destination: 'Rodoviária do Plano Piloto', time: 3, line: '110.1' },
    { id: '110.2', destination: 'W3 Sul - Via SIA', time: 8, line: '110.2' },
    { id: '108.1', destination: 'L2 Norte - UnB', time: 12, line: '108.1' },
    { id: '154.4', destination: 'Cruzeiro Novo', time: 5, line: '154.4' },
    { id: '163.2', destination: 'Guará II - Via Estádio', time: 15, line: '163.2' },
  ],
  metroLines: [
    { id: 'Verde', destination: 'Terminal Ceilândia', time: 7, line: 'Verde' },
    { id: 'Laranja', destination: 'Samambaia', time: 4, line: 'Laranja' },
  ],
  lastUpdate: new Date().toISOString(),
};

export const useTransportData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulação de chamada de API
        // Em produção, substituir pela URL real da API GTFS-Realtime
        // const response = await axios.get('https://api.transporte.brasilia.gtfs/vehicles');
        
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simula delay de rede
        
        setData(mockTransportData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados de transporte');
        console.error('Erro na API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Atualização a cada 30 segundos (opcional)
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};