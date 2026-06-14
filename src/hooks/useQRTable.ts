import { useState, useEffect } from 'react';

export function useQRTable(defaultTable: string = 'A1') {
  const [selectedTable, setSelectedTable] = useState<string>(defaultTable);
  const [isValidQR, setIsValidQR] = useState<boolean>(true);

  useEffect(() => {
    // Determine table from URL parameter (simulating QR Code scan)
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setSelectedTable(tableParam);
      setIsValidQR(true);
    } else {
      // In real scenario, might set to false until scanned
      setIsValidQR(true);
    }
  }, []);

  return {
    selectedTable,
    setSelectedTable,
    isValidQR,
    setIsValidQR,
  };
}
