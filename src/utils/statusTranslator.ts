// Utilidad para traducir estados de personajes del inglés al español
// Mantiene las keys en inglés para compatibilidad con la API

export const translateStatus = (status: string): string => {
  switch (status) {
    case 'Alive':
      return 'Vivo';
    case 'Dead':
      return 'Muerto';
    case 'unknown':
      return 'Desconocido';
    default:
      return status; // Si no se reconoce, devolver el original
  }
};

// Función para traducir el género también
export const translateGender = (gender: string): string => {
  switch (gender) {
    case 'Male':
      return 'Masculino';
    case 'Female':
      return 'Femenino';
    case 'Genderless':
      return 'Sin género';
    case 'unknown':
      return 'Desconocido';
    default:
      return gender; // Si no se reconoce, devolver el original
  }
}; 