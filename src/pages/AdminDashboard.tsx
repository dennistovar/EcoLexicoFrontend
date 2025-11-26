import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from 'flowbite-react';
import { CreateWordForm } from '../components/CreateWordForm';
import axios from 'axios';

// Tipos
interface Word {
  id: number;
  palabra: string;
  significado: string;
  ejemplo: string;
  pronunciacion: string;
  audio_url: string;
  region_id: number;
  provincia_id: number;
}

// Mapeo de regiones
const regionNames: Record<number, { name: string; color: string }> = {
  1: { name: 'Coast', color: 'info' },
  2: { name: 'Andes', color: 'success' },
  3: { name: 'Amazon', color: 'warning' },
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<Word | null>(null);
  const [wordToEdit, setWordToEdit] = useState<Word | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Cargar palabras
  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/words`);
      setWords(response.data);
    } catch (error) {
      console.error('Error loading words:', error);
      alert('Failed to load words. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  // Abrir modal de confirmación de borrado
  const confirmDelete = (word: Word) => {
    setWordToDelete(word);
    setShowDeleteModal(true);
  };

  // Abrir modal de edición
  const openEditModal = (word: Word) => {
    setWordToEdit(word);
    setShowCreateModal(true);
  };

  // Cerrar modal de creación/edición
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setWordToEdit(null); // Resetear palabra a editar
  };

  // Ejecutar borrado
  const handleDelete = async () => {
    if (!wordToDelete) return;

    setDeleting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_URL}/api/words/${wordToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar lista local
      setWords(words.filter(w => w.id !== wordToDelete.id));
      setShowDeleteModal(false);
      setWordToDelete(null);
      
      alert(' Word deleted successfully!');
    } catch (error) {
      console.error('Error deleting word:', error);
      alert(' Failed to delete word. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Reproducir audio
  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
      alert('Error playing audio');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* --- NAVBAR SUPERIOR --- */}
      <nav className="bg-white shadow-md border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600" style={{ fontFamily: 'cursive' }}>
                EcoLéxico Admin
              </h1>
            </div>
            
            {/* Right side */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                Welcome, Administrator 👤
              </span>
              <Button color="failure" outline size="sm" onClick={handleLogout}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- SECCIÓN DE ESTADÍSTICAS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Words (Azul) */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Words</p>
                <p className="text-4xl font-bold">{words.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Card 2: Regions (Verde) */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Regions</p>
                <p className="text-4xl font-bold">3</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Card 3: Audio Files (Naranja) */}
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Audio Files</p>
                <p className="text-4xl font-bold">{words.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            </div>
          </Card>

        </div>
      </section>

      {/* --- SECCIÓN PRINCIPAL: WORDS MANAGEMENT --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card className="shadow-xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Words Management</h2>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Word
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="text-gray-600 mt-4">Loading words...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && words.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No words yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first word to the database</p>
              <Button color="success" onClick={() => setShowCreateModal(true)}>
                Add First Word
              </Button>
            </div>
          )}

          {/* Tabla de Palabras */}
          {!loading && words.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Word</th>
                    <th scope="col" className="px-6 py-3">Meaning</th>
                    <th scope="col" className="px-6 py-3">Region</th>
                    <th scope="col" className="px-6 py-3">Audio</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word) => (
                    <tr key={word.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{word.palabra}</div>
                        {word.pronunciacion && (
                          <div className="text-sm text-gray-500">{word.pronunciacion}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {word.significado.length > 60 
                          ? word.significado.substring(0, 60) + '...' 
                          : word.significado}
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={regionNames[word.region_id]?.color || 'gray'}>
                          {regionNames[word.region_id]?.name || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => playAudio(word.audio_url)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Play audio"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(word)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit word"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => confirmDelete(word)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete word"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </Card>
      </section>

      {/* --- MODAL: CREATE/EDIT WORD --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={closeCreateModal}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {wordToEdit ? 'Edit Word' : 'Add New Word'}
                  </h3>
                  <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <CreateWordForm 
                  wordToEdit={wordToEdit || undefined}
                  onSuccess={() => {
                    closeCreateModal();
                    fetchWords();
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CONFIRM DELETE --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowDeleteModal(false)}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="text-center">
                  <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Are you sure?
                  </h3>
                  <p className="text-gray-600 mb-1">
                    Do you really want to delete the word:
                  </p>
                  <p className="text-lg font-bold text-red-600 mb-4">
                    "{wordToDelete?.palabra}"
                  </p>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <Button color="failure" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : "Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};