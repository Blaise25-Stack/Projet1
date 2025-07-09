import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Download } from 'lucide-react';

interface PDFUploadProps {
  currentFiles?: string[];
  onFilesChange: (files: string[]) => void;
  label: string;
  className?: string;
  maxFiles?: number;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ 
  currentFiles = [], 
  onFilesChange, 
  label, 
  className = "",
  maxFiles = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: string[] = [];
    let processedCount = 0;

    Array.from(files).forEach((file) => {
      // Vérifier le type de fichier
      if (file.type !== 'application/pdf') {
        alert(`${file.name} n'est pas un fichier PDF valide`);
        return;
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} dépasse la taille maximale de 10MB`);
        return;
      }

      setIsUploading(true);
      
      // Créer un URL local pour le fichier
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newFiles.push(result);
        processedCount++;
        
        if (processedCount === files.length) {
          const updatedFiles = [...currentFiles, ...newFiles].slice(0, maxFiles);
          onFilesChange(updatedFiles);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const downloadFile = (fileData: string, index: number) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = `document_${index + 1}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileName = (fileData: string, index: number) => {
    // Extraire le nom du fichier depuis les métadonnées ou utiliser un nom par défaut
    return `Document ${index + 1}.pdf`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Liste des fichiers actuels */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          {currentFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">{getFileName(file, index)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => downloadFile(file, index)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Supprimer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {currentFiles.length < maxFiles && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id={`pdf-upload-${label.replace(/\s+/g, '-')}`}
          />
          <label
            htmlFor={`pdf-upload-${label.replace(/\s+/g, '-')}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Chargement...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Ajouter des PDF
              </>
            )}
          </label>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>Formats acceptés: PDF uniquement. Taille max: 10MB par fichier.</p>
        <p>Maximum {maxFiles} fichiers. {currentFiles.length}/{maxFiles} utilisés.</p>
      </div>
    </div>
  );
};

export default PDFUpload;