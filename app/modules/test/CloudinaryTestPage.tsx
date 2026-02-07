import { useState } from 'react';

export default function CloudinaryTestPage() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadTime, setUploadTime] = useState<number>(0);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setStatus('uploading');
    setResult(null);
    setError('');
    setImageUrl('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'nutricao-app/meals');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      console.log('Upload URL:', uploadUrl);
      console.log('File:', file.name, file.type, file.size, 'bytes');

      const startTime = Date.now();
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      const time = Date.now() - startTime;
      setUploadTime(time);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setImageUrl(data.secure_url);
      setStatus('success');
      console.log('Upload success:', data);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  const configOk = cloudName && uploadPreset;

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', padding: 30, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginBottom: 10 }}>🖼️ Teste de Upload Cloudinary</h1>
        
        {/* Status */}
        <div style={{ 
          padding: 15, 
          borderRadius: 4, 
          marginBottom: 20,
          background: status === 'success' ? '#e8f5e9' : status === 'error' ? '#ffebee' : status === 'uploading' ? '#fff3e0' : '#e3f2fd',
          color: status === 'success' ? '#388e3c' : status === 'error' ? '#d32f2f' : status === 'uploading' ? '#f57c00' : '#1976d2'
        }}>
          {status === 'idle' && (configOk ? '✅ Configuração OK! Selecione uma imagem.' : '❌ Configuração incompleta')}
          {status === 'uploading' && '📤 Fazendo upload...'}
          {status === 'success' && `✅ Upload realizado com sucesso em ${uploadTime}ms!`}
          {status === 'error' && `❌ Erro no upload: ${error}`}
        </div>

        {/* Config */}
        <div style={{ background: '#f9f9f9', padding: 15, borderRadius: 4, marginBottom: 20, fontFamily: 'monospace', fontSize: 14 }}>
          <div style={{ marginBottom: 10 }}><strong>Configuração Detectada:</strong></div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ color: '#666', display: 'inline-block', width: 150 }}>Cloud Name:</span>
            {cloudName ? <span style={{ color: 'green' }}>✅ {cloudName}</span> : <span style={{ color: 'red' }}>❌ Não configurado</span>}
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ color: '#666', display: 'inline-block', width: 150 }}>Upload Preset:</span>
            {uploadPreset ? <span style={{ color: 'green' }}>✅ {uploadPreset}</span> : <span style={{ color: 'red' }}>❌ Não configurado</span>}
          </div>
        </div>

        {/* File Input */}
        {configOk && (
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Selecione uma imagem para testar:
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={status === 'uploading'}
              style={{ 
                padding: 10, 
                border: '2px dashed #ddd', 
                borderRadius: 4, 
                width: '100%',
                cursor: status === 'uploading' ? 'not-allowed' : 'pointer'
              }}
            />
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ marginTop: 20, padding: 15, background: '#f5f5f5', borderRadius: 4, maxHeight: 400, overflowY: 'auto' }}>
            <strong>Detalhes da Imagem:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, fontSize: 13 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <h3>Preview da Imagem Uploadada:</h3>
            <img 
              src={imageUrl} 
              alt="Uploaded" 
              style={{ maxWidth: '100%', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
            />
            <p style={{ marginTop: 10, color: '#666' }}>
              <strong>URL:</strong> <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
            </p>
          </div>
        )}

        {/* Error Details */}
        {status === 'error' && (
          <div style={{ marginTop: 20, padding: 15, background: '#ffebee', borderRadius: 4 }}>
            <strong>Possíveis causas:</strong>
            <ul>
              <li>Cloud Name incorreto</li>
              <li>Upload Preset não existe ou está como "Signed"</li>
              <li>Preset não tem permissão para unsigned uploads</li>
            </ul>
            <strong>Verifique:</strong>
            <ol>
              <li>Cloud Name: <code>{cloudName}</code></li>
              <li>Upload Preset: <code>{uploadPreset}</code></li>
              <li>Preset existe no Cloudinary Dashboard?</li>
              <li>Signing Mode está como "Unsigned"?</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
