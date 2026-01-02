import { useState, useEffect } from "react";
import { Button, Label, TextInput, Textarea, FileInput, Select } from "flowbite-react";
import { uploadAudio } from "../services/storageService";
import axios from "axios";

// Interface para las props
interface Props {
  wordToEdit?: any;
  onSuccess?: () => void;
}

export const CreateWordForm = ({ wordToEdit, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    palabra: "",
    significado: "",
    ejemplo: "",
    region_id: 1, 
    provincia_id: 1,
    audio_url: "" // Agregar para mantener la URL existente
  });

  // useEffect para llenar el formulario cuando hay palabra para editar
  useEffect(() => {
    if (wordToEdit) {
      setFormData({
        palabra: wordToEdit.palabra || "",
        significado: wordToEdit.significado || "",
        ejemplo: wordToEdit.ejemplo || "",
        region_id: wordToEdit.region_id || 1,
        provincia_id: wordToEdit.provincia_id || 1,
        audio_url: wordToEdit.audio_url || ""
      });
    }
  }, [wordToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.palabra.trim() || !formData.significado.trim()) {
      alert("⚠️ Word and meaning are required");
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      let finalAudioUrl = "";

      // Lógica de audio: priorizar nuevo archivo, sino mantener existente
      if (audioFile) {
        // Subir nuevo archivo a Cloudinary
        finalAudioUrl = await uploadAudio(audioFile);
      } else if (formData.audio_url) {
        // Mantener URL existente (modo edición)
        finalAudioUrl = formData.audio_url;
      }

      // Validar que haya una URL de audio válida
      if (!finalAudioUrl) {
        alert("⚠️ Please upload an audio file");
        setLoading(false);
        return;
      }

      const dataToSend = {
        palabra: formData.palabra,
        significado: formData.significado,
        ejemplo: formData.ejemplo,
        region_id: formData.region_id,
        provincia_id: formData.provincia_id,
        audio_url: finalAudioUrl
      };

      // Obtener token de autenticación
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (wordToEdit) {
        // MODO EDICIÓN: PUT request
        await axios.put(`${API_URL}/api/words/${wordToEdit.id}`, dataToSend, { headers });
        alert("✅ Word updated successfully!");
      } else {
        // MODO CREACIÓN: POST request
        await axios.post(`${API_URL}/api/words`, dataToSend, { headers });
        alert("✅ Word saved successfully!");
      }
      
      // Reset form solo si es creación
      if (!wordToEdit) {
        setFormData({
          palabra: "",
          significado: "",
          ejemplo: "",
          region_id: 1,
          provincia_id: 1,
          audio_url: ""
        });
        setAudioFile(null);
      }
      
      // Llamar callback si existe
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error saving word:", error);
      alert(" Error saving. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
            <label className="block mb-3">
              <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </span>
                Word / Palabra
              </span>
              <input 
                type="text"
                placeholder="e.g: Chévere, Guambra, Chuchuqui..." 
                required 
                value={formData.palabra}
                onChange={e => setFormData({...formData, palabra: e.target.value})}
                className="w-full px-4 py-3.5 text-base font-semibold text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300"
              />
            </label>
        </div>
        <div className="group">
            <label className="block mb-3">
              <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Meaning / Significado
              </span>
              <textarea 
                placeholder="Provide a clear definition of the word in English..." 
                required 
                rows={3}
                value={formData.significado}
                onChange={e => setFormData({...formData, significado: e.target.value})}
                className="w-full px-4 py-3.5 text-base font-medium text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal resize-none hover:border-gray-300"
              />
            </label>
        </div>
        <div className="group">
            <label className="block mb-3">
              <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
                Example / Ejemplo
              </span>
              <input 
                type="text"
                placeholder="E.g: La fiesta estuvo chévere (The party was cool)" 
                value={formData.ejemplo}
                onChange={e => setFormData({...formData, ejemplo: e.target.value})}
                className="w-full px-4 py-3.5 text-base font-medium text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300"
              />
            </label>
        </div>
        <div className="group">
            <label className="block mb-3">
              <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Region / Región
              </span>
              <select 
                required
                value={formData.region_id}
                onChange={e => setFormData({...formData, region_id: parseInt(e.target.value)})}
                className="w-full px-4 py-3.5 text-base font-semibold text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 cursor-pointer hover:border-gray-300">
                <option value="1">🌊 Coast (Costa)</option>
                <option value="2">⛰️ Highlands (Sierra)</option>
                <option value="3">🌿 Amazon (Oriente)</option>
              </select>
            </label>
        </div>
        <div className="group">
            <label className="block mb-3">
              <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </span>
                Audio Pronunciation
                {!wordToEdit && <span className="text-red-500 font-black ml-1">*</span>}
              </span>
              <div className="relative">
                <input 
                  type="file"
                  accept="audio/*" 
                  required={!wordToEdit}
                  onChange={e => { if(e.target.files) setAudioFile(e.target.files[0]); }}
                  className="w-full px-4 py-3.5 text-base font-medium text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 cursor-pointer hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-rose-500 file:text-white hover:file:from-pink-600 hover:file:to-rose-600 file:cursor-pointer"
                />
              </div>
            </label>
            {audioFile && (
              <div className="mt-3 p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <p className="text-sm text-white font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">{audioFile.name}</span>
                </p>
              </div>
            )}
            {wordToEdit && !audioFile && formData.audio_url && (
              <div className="mt-3 p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <p className="text-sm text-white font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Current audio preserved • Upload new to replace
                </p>
              </div>
            )}
        </div>
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed uppercase tracking-wide"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {wordToEdit ? "Updating..." : "Saving..."}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  {wordToEdit ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  )}
                </svg>
                {wordToEdit ? "Update Word" : "Save Word"}
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};