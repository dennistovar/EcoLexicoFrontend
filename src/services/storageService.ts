import axios from 'axios';

export const uploadAudio = async (file: File): Promise<string> => {
  try {
    // 1. Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ecolexico');
    formData.append('resource_type', 'video'); // Cloudinary requiere 'video' para audios

    // 2. Realizar POST a Cloudinary
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/ddeztd4vi/upload',
      formData
    );

    // 3. Retornar la URL segura del archivo subido
    return response.data.secure_url;
  } catch (error) {
    console.error('Error subiendo a Cloudinary:', error);
    throw error;
  }
};
