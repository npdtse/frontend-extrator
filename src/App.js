// --- Arquivo: src/App.js ---

import React, { useState } from 'react';
import './App.css'; // create-react-app já cria este arquivo para estilos

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setStatusMessage(''); // Limpa a mensagem ao selecionar novo arquivo
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage('Por favor, selecione um arquivo primeiro.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Processando o arquivo...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // A URL completa da nossa API Flask
      const response = await fetch('https://extrator-5xps.onrender.com/api/extract-and-download', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatusMessage('Sucesso! O download irá começar.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${selectedFile.name.replace('.pdf', '')}_extraido.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        setStatusMessage(`Erro: ${errorData.erro || 'Ocorreu um problema no servidor.'}`);
      }
    } catch (error) {
      setStatusMessage('Erro de conexão: Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Extrator de Dados de PDF</h1>
        <p>Selecione a folha de pagamento para extrair e baixar a planilha.</p>
        <input type="file" onChange={handleFileChange} accept=".pdf" />
        <button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? 'Processando...' : 'Extrair e Baixar'}
        </button>
        {statusMessage && <p className="status">{statusMessage}</p>}
      </header>
    </div>
  );
}

export default App;