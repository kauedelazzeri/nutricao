/**
 * Cloudinary Upload Helper
 * 
 * Faz upload de imagens de refeições para o Cloudinary.
 * Usa unsigned upload com preset configurado no Cloudinary dashboard.
 */

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Faz upload de uma foto de refeição para o Cloudinary
 * @param file - Arquivo de imagem (File object)
 * @param options - Opções de upload (timeout, retries, signal)
 * @returns Promise com dados da imagem uploadada
 */
export async function uploadMealPhoto(
  file: File,
  options: {
    timeout?: number;
    maxRetries?: number;
    signal?: AbortSignal;
  } = {}
): Promise<CloudinaryResponse> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary configuration. Check your .env.local file.');
  }

  const { timeout = 60000, maxRetries = 3, signal } = options;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'nutricao-app/meals');

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[Cloudinary] Tentativa ${attempt + 1}/${maxRetries}:`, {
        fileName: file.name,
        fileSize: file.size,
        timeout,
        timestamp: new Date().toISOString()
      });

      // Create AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`[Cloudinary] Timeout atingido (${timeout}ms) - abortando`);
        controller.abort();
      }, timeout);

      // Combine external signal with timeout signal
      if (signal) {
        signal.addEventListener('abort', () => {
          console.log('[Cloudinary] Upload cancelado externamente');
          controller.abort();
        });
      }

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        console.log('[Cloudinary] Resposta recebida:', {
          status: response.status,
          ok: response.ok
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('[Cloudinary] Erro na resposta:', error);
          throw new Error(error.error?.message || 'Failed to upload image');
        }

        const result = await response.json();
        console.log('[Cloudinary] Upload bem-sucedido:', {
          publicId: result.public_id,
          url: result.secure_url
        });
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error: any) {
      lastError = error;

      console.error(`[Cloudinary] Erro na tentativa ${attempt + 1}:`, {
        name: error.name,
        message: error.message
      });

      // Se foi aborted pelo usuário, não retry
      if (error.name === 'AbortError' && signal?.aborted) {
        throw new Error('Upload cancelado pelo usuário');
      }

      // Se foi timeout ou erro de rede, retry (exceto na última tentativa)
      if (attempt < maxRetries - 1) {
        // Espera exponencial: 1s, 2s, 4s...
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`[Cloudinary] Aguardando ${delay}ms antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Última tentativa falhou
      if (error.name === 'AbortError') {
        throw new Error('Upload timeout - arquivo muito grande ou conexão lenta');
      }
      throw error;
    }
  }

  throw lastError || new Error('Upload failed after retries');
}

/**
 * Alias para uploadMealPhoto (para compatibilidade)
 * @param file - Arquivo de imagem
 * @param signal - AbortSignal para cancelar upload
 */
export async function uploadToCloudinary(
  file: File,
  signal?: AbortSignal
): Promise<string> {
  const result = await uploadMealPhoto(file, {
    timeout: 60000,
    maxRetries: 3,
    signal
  });
  return result.secure_url;
}

/**
 * Deleta uma foto do Cloudinary (requer assinatura backend)
 * Por ora, apenas loga - implementar backend function futuramente
 * @param publicId - Public ID da imagem no Cloudinary
 */
export async function deleteMealPhoto(publicId: string): Promise<void> {
  // Delete requer backend signature por segurança
  // Por ora, manter fotos no Cloudinary (dentro do limite gratuito de 25GB)
  // TODO: Implementar Supabase Edge Function para deletar com assinatura
  console.log('Photo deletion not implemented yet:', publicId);
}
