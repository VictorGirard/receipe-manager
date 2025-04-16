import React, { useState } from 'react';
import { Recette, Categorie } from '../types/recette';
import { createRecette, updateRecette } from '../services/airtable';

const categories: Categorie[] = [
  'Entrée',
  'Plat principal',
  'Dessert',
  'Apéritif',
  'Boisson',
  'Sauce',
  'Accompagnement'
];

interface RecetteFormProps {
  initialRecette?: Recette;
  onSubmit: (recette: Recette) => void;
  onError?: (error: Error) => void;
}

export const RecetteForm: React.FC<RecetteFormProps> = ({ 
  initialRecette, 
  onSubmit,
  onError 
}) => {
  const [recette, setRecette] = useState<Partial<Recette>>(initialRecette || {
    nom: '',
    duree: 0,
    calories: 0,
    categorie: 'Plat principal',
    proteines: 0,
    glucides: 0,
    lipides: 0,
    fibres: 0,
    taillePortion: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Recette, string>>>({});

  const validateField = (field: keyof Recette, value: any): string | undefined => {
    switch (field) {
      case 'nom':
        return !value ? 'Le nom est obligatoire' : undefined;
      case 'duree':
        return value <= 0 ? 'La durée doit être supérieure à 0' : undefined;
      case 'calories':
        return value <= 0 ? 'Les calories doivent être supérieures à 0' : undefined;
      case 'categorie':
        return !value ? 'La catégorie est obligatoire' : undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof Recette, value: any) => {
    setRecette(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de tous les champs
    const newErrors: Partial<Record<keyof Recette, string>> = {};
    Object.keys(recette).forEach(field => {
      const error = validateField(field as keyof Recette, recette[field as keyof Recette]);
      if (error) {
        newErrors[field as keyof Recette] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (initialRecette?.id) {
        const updatedRecette = await updateRecette(initialRecette.id, recette);
        onSubmit(updatedRecette);
      } else {
        const newRecette = await createRecette(recette as Omit<Recette, 'id'>);
        onSubmit(newRecette);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      onError?.(error as Error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialRecette ? 'Modifier la recette' : 'Nouvelle recette'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={recette.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.nom ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            value={recette.categorie}
            onChange={(e) => handleChange('categorie', e.target.value as Categorie)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.categorie ? 'border-red-500' : ''
            }`}
            required
          >
            {categories.map((categorie) => (
              <option key={categorie} value={categorie}>
                {categorie}
              </option>
            ))}
          </select>
          {errors.categorie && <p className="mt-1 text-sm text-red-600">{errors.categorie}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
          <input
            type="number"
            value={recette.duree}
            onChange={(e) => handleChange('duree', parseInt(e.target.value))}
            min="0"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.duree ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.duree && <p className="mt-1 text-sm text-red-600">{errors.duree}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
          <input
            type="number"
            value={recette.calories}
            onChange={(e) => handleChange('calories', parseInt(e.target.value))}
            min="0"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.calories ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.calories && <p className="mt-1 text-sm text-red-600">{errors.calories}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Taille de portion</label>
          <input
            type="text"
            value={recette.taillePortion}
            onChange={(e) => handleChange('taillePortion', e.target.value)}
            placeholder="Ex: 1 portion, 4 personnes..."
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.taillePortion ? 'border-red-500' : ''
            }`}
          />
          {errors.taillePortion && <p className="mt-1 text-sm text-red-600">{errors.taillePortion}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Protéines (g)</label>
          <input
            type="number"
            value={recette.proteines}
            onChange={(e) => handleChange('proteines', parseFloat(e.target.value))}
            min="0"
            step="0.1"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.proteines ? 'border-red-500' : ''
            }`}
          />
          {errors.proteines && <p className="mt-1 text-sm text-red-600">{errors.proteines}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Glucides (g)</label>
          <input
            type="number"
            value={recette.glucides}
            onChange={(e) => handleChange('glucides', parseFloat(e.target.value))}
            min="0"
            step="0.1"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.glucides ? 'border-red-500' : ''
            }`}
          />
          {errors.glucides && <p className="mt-1 text-sm text-red-600">{errors.glucides}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lipides (g)</label>
          <input
            type="number"
            value={recette.lipides}
            onChange={(e) => handleChange('lipides', parseFloat(e.target.value))}
            min="0"
            step="0.1"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.lipides ? 'border-red-500' : ''
            }`}
          />
          {errors.lipides && <p className="mt-1 text-sm text-red-600">{errors.lipides}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fibres (g)</label>
          <input
            type="number"
            value={recette.fibres}
            onChange={(e) => handleChange('fibres', parseFloat(e.target.value))}
            min="0"
            step="0.1"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.fibres ? 'border-red-500' : ''
            }`}
          />
          {errors.fibres && <p className="mt-1 text-sm text-red-600">{errors.fibres}</p>}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients</label>
        <textarea
          value={recette.ingredients}
          onChange={(e) => handleChange('ingredients', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.ingredients ? 'border-red-500' : ''
          }`}
          placeholder="Liste des ingrédients..."
        />
        {errors.ingredients && <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Étapes de préparation</label>
        <textarea
          value={recette.etapes}
          onChange={(e) => handleChange('etapes', e.target.value)}
          rows={6}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.etapes ? 'border-red-500' : ''
          }`}
          placeholder="Décrivez les étapes de préparation..."
        />
        {errors.etapes && <p className="mt-1 text-sm text-red-600">{errors.etapes}</p>}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialRecette ? 'Mettre à jour' : 'Créer la recette'}
        </button>
      </div>
    </form>
  );
}; 