import { useState } from 'react';
import { Recette } from '../types/recette';

interface ModalState {
  isOpen: boolean;
  selectedRecette: Recette | null;
}

interface ModalHandlers {
  openModal: (recette: Recette) => void;
  closeModal: () => void;
}

export const useModal = (): [ModalState, ModalHandlers] => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    selectedRecette: null,
  });

  const openModal = (recette: Recette) => {
    setModalState({
      isOpen: true,
      selectedRecette: recette,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedRecette: null,
    });
  };

  return [modalState, { openModal, closeModal }];
};

export const getModalContent = (recette: Recette) => {
  return {
    title: recette.nom,
    duration: `${recette.duree} min`,
    calories: `${recette.calories} kcal`,
    category: recette.categorie,
    ingredients: recette.ingredients?.split('\\n') || [],
    steps: recette.etapes?.split('\\n') || [],
  };
};

export const getModalStyle = () => {
  return {
    container: 'mx-auto max-w-2xl w-full bg-white dark:bg-dark-surface rounded-xl p-6',
    content: 'space-y-4',
    section: 'bg-gray-50 dark:bg-sky-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700',
    title: 'text-3xl font-bold text-gray-800 dark:text-white mb-4',
    closeButton: 'absolute top-4 right-4 text-gray-500 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300',
  };
}; 