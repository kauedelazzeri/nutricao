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
 * @returns Promise com dados da imagem uploadada
 */
export async function uploadMealPhoto(file: File): Promise<CloudinaryResponse> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary configuration. Check your .env.local file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'nutricao-app/meals');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload image');
  }

  return response.json();
}

/**
 * Alias para uploadMealPhoto (para compatibilidade)
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const result = await uploadMealPhoto(file);
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
