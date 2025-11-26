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
    pronunciacion: "",
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
        pronunciacion: wordToEdit.pronunciacion || "",
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
        pronunciacion: formData.pronunciacion,
        region_id: formData.region_id,
        provincia_id: formData.provincia_id,
        audio_url: finalAudioUrl
      };

      if (wordToEdit) {
        // MODO EDICIÓN: PUT request
        await axios.put(`${API_URL}/api/words/${wordToEdit.id}`, dataToSend);
        alert("Word updated successfully!");
      } else {
        // MODO CREACIÓN: POST request
        await axios.post(`${API_URL}/api/words`, dataToSend);
        alert("Word saved successfully!");
      }
      
      // Reset form solo si es creación
      if (!wordToEdit) {
        setFormData({
          palabra: "",
          significado: "",
          ejemplo: "",
          pronunciacion: "",
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <div className="mb-2 block"><Label>Word</Label></div>
            <TextInput 
              placeholder="e.g: Chévere" 
              required 
              value={formData.palabra}
              onChange={e => setFormData({...formData, palabra: e.target.value})} 
            />
        </div>
        <div>
            <div className="mb-2 block"><Label>Pronunciation</Label></div>
            <TextInput 
              placeholder="e.g: CHEH-veh-reh" 
              value={formData.pronunciacion}
              onChange={e => setFormData({...formData, pronunciacion: e.target.value})} 
            />
        </div>
        <div>
            <div className="mb-2 block"><Label>Meaning</Label></div>
            <Textarea 
              placeholder="Definition..." 
              required 
              rows={3}
              value={formData.significado}
              onChange={e => setFormData({...formData, significado: e.target.value})} 
            />
        </div>
        <div>
            <div className="mb-2 block"><Label>Example</Label></div>
            <TextInput 
              placeholder="E.g: The party was cool" 
              value={formData.ejemplo}
              onChange={e => setFormData({...formData, ejemplo: e.target.value})} 
            />
        </div>
        <div>
            <div className="mb-2 block"><Label>Region</Label></div>
            <Select 
              required
              value={formData.region_id}
              onChange={e => setFormData({...formData, region_id: parseInt(e.target.value)})}>
              <option value="1">Coast</option>
              <option value="2">Highlands (Sierra)</option>
              <option value="3">Amazon (Oriente)</option>
            </Select>
        </div>
        <div>
            <div className="mb-2 block"><Label>Audio MP3</Label></div>
            <FileInput 
              accept="audio/*" 
              required={!wordToEdit} // Solo requerido si es nueva palabra
              onChange={e => { if(e.target.files) setAudioFile(e.target.files[0]); }} 
            />
            {audioFile && (
              <p className="text-sm text-green-600 mt-1">✓ {audioFile.name}</p>
            )}
            {wordToEdit && !audioFile && formData.audio_url && (
              <p className="text-sm text-blue-600 mt-1">
                📎 Current audio file is preserved (upload new one to replace)
              </p>
            )}
        </div>
        <Button type="submit" disabled={loading} color="success" className="w-full">
          {loading ? (wordToEdit ? "Updating..." : "Uploading...") : (wordToEdit ? "Update Word" : "Save Word")}
        </Button>
      </form>
    </div>
  );
};