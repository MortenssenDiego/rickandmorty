# Rick & Morty App - Challenge de Desarrollo

Aplicación móvil para visualizar personajes de Rick & Morty, desarrollada con **React Native CLI** y TypeScript.

---

## 🎯 Sobre este Proyecto

Este proyecto fue desarrollado como parte de un challenge técnico, demostrando habilidades avanzadas en desarrollo móvil híbrido, arquitectura de software y optimización de rendimiento. El desarrollo se realizó utilizando un enfoque moderno que combina experiencia técnica sólida con herramientas de productividad contemporáneas.

**Tiempo de Desarrollo:** 8 horas (aproximadamente la mitad del tiempo estimado sin herramientas de apoyo)

---

## 🚀 ¿Por qué React Native CLI?

El proyecto fue migrado desde Expo a React Native CLI para facilitar el uso de dependencias nativas, mejorar la compatibilidad con testing (Jest, React Native Testing Library) y tener mayor control sobre el entorno de desarrollo.

### Resumen Visual

| Característica         | React Native CLI | Expo CLI         |
|------------------------|------------------|------------------|
| Control de dependencias| Total            | Parcial (muchas automáticas) |
| Problemas con Jest     | Raros            | Frecuentes (por ESM/TS en node_modules) |
| Facilidad de testing   | Alta             | Baja/Media       |
| Mocking de nativos     | Sencillo         | Difícil (por dependencias internas) |

---

## 🚀 Características Implementadas

### Funcionalidades Core
- **Lista de Personajes**: Navega por todos los personajes de Rick & Morty con scroll infinito optimizado.
- **Buscador Avanzado**: Búsqueda por nombre con debounce y filtros dinámicos.
- **Filtros Dinámicos**: Tags para filtrar por estado, especie, género.
- **Detalles de Personaje**: Información completa de cada personaje.
- **Sistema de Favoritos**: Agregar/quitar personajes de favoritos con almacenamiento persistente.
- **Tema Oscuro/Claro**: Cambio entre temas con colores verdes del portal de Rick & Morty.
- **Diseño Responsivo**: Optimizado para dispositivos móviles y tablets.
- **Manejo de Errores**: Manejo completo de errores con mecanismos de reintento.
- **Testing Unitario**: Cobertura completa de tests para lógica de negocio.

### Optimizaciones Avanzadas de Memoria
- **useTransition**: Para operaciones de búsqueda y filtrado no bloqueantes.
- **useDeferredValue**: Para búsquedas con debounce optimizado.
- **useMemo & useCallback**: Para memoización de estilos, funciones y datos.
- **React.memo**: Para componentes optimizados con prevención de re-renders.
- **Virtualización de Listas**: removeClippedSubviews, maxToRenderPerBatch, windowSize.
- **Optimización de Imágenes**: Cache forzado, dimensiones pre-calculadas, lazy loading.
- **Gestión de Estado Optimizada**: Zustand con persistencia, memoización de stores.
- **Íconos Vectoriales**: MaterialCommunityIcons para consistencia y escalabilidad.

---

## 📦 Instalación y Requisitos Previos

- **Node.js** (versión 18 o superior)
- **pnpm** (recomendado) o npm
- **Git**

```bash
# Clonar proyecto

# Instalar pnpm globalmente
npm install -g pnpm

# Instalar dependencias
pnpm install

# Emular en Dispositivo Virtual de Android Studio
pnpm android
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
pnpm test
```

## Estructura de Tests

```
src/
├── features/X/__tests__/     # Tests de X Feature
├── hooks/__tests__/        # Tests de Hooks
└── store/__tests__/        # Tests de stores Zustand
```

---

## 🔧 Comandos de Desarrollo

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Instalar dependencias
pnpm install

# Emular en Dispositivo Virtual de Android Studio
pnpm android
```

---

## 📚 Tecnologías principales
- React Native CLI
- TypeScript
- Zustand (estado global)
- Axios (API)
- React Navigation
- React Native Vector Icons
- AsyncStorage
- React Native Testing Library + Jest
- pnpm (gestor de paquetes)

---

## 📱 Integración API

La aplicación se integra con la [API de Rick & Morty](https://rickandmortyapi.com/) para obtener datos de personajes. El servicio API está construido con:

- **Servicio API Genérico**: Instancia axios reutilizable con interceptores.
- **Manejo de Errores**: Manejo completo de errores con mensajes amigables.
- **Paginación**: Implementación de scroll infinito para rendimiento óptimo.
- **Carga Inicial**: Obtención de todas las opciones de filtros al iniciar la app.
- **Caché**: Gestión eficiente de datos para minimizar llamadas API.

---

## 🎨 Sistema de Temas

- **Colores del Portal Verde**: Esquema de colores inspirado en Rick & Morty.
- **Modos Oscuro/Claro**: Soporte completo de temas con preferencias persistentes.
- **Diseño Consistente**: Lenguaje de diseño unificado en todos los componentes.

---

## 💡 Enfoque de Desarrollo Moderno

### Colaboración con Herramientas de IA

Este proyecto fue desarrollado utilizando un enfoque moderno que incluye la colaboración estratégica con herramientas de IA para tareas específicas como:

- **Documentación y Comentarios**: Generación de comentarios técnicos detallados.
- **Automatización de Tareas Repetitivas**: Optimización de flujos de trabajo.
- **Investigación y Referencias**: Acceso rápido a mejores prácticas y documentación.
- **Revisión de Código**: Análisis de patrones y optimizaciones.

### Valor del Desarrollador Senior

La capacidad de un desarrollador senior no se define únicamente por escribir código desde cero, sino por:

- **Arquitectura y Diseño**: Capacidad de diseñar sistemas escalables y mantenibles.
- **Optimización y Rendimiento**: Implementación de mejores prácticas y optimizaciones.
- **Uso Estratégico de Herramientas**: Aprovechamiento inteligente de todas las herramientas disponibles.
- **Resolución de Problemas**: Capacidad de identificar y resolver desafíos técnicos complejos.
- **Mantenibilidad**: Código bien estructurado y documentado para equipos.

### Evolución de la Industria

La industria del desarrollo de software ha evolucionado significativamente, donde:

- **Herramientas de Productividad**: Son parte integral del flujo de trabajo profesional.
- **Colaboración con IA**: Mejora la eficiencia sin reemplazar la experiencia técnica.
- **Aprendizaje Continuo**: Adaptación a nuevas tecnologías y metodologías.
- **Enfoque en Valor**: Resultados de calidad en tiempo optimizado.

---

## 📊 Análisis de Tiempo de Desarrollo

**Tiempo Real de Desarrollo: 8 horas**

### Desglose de Actividades:
- **Configuración del Proyecto**: 30 minutos
- **Integración API y Servicios**: 1 hora
- **Gestión de Estado y Persistencia**: 45 minutos
- **Componentes UI y Pantallas**: 1.5 horas
- **Optimizaciones Avanzadas**: 2 horas
- **Navegación y Enrutamiento**: 30 minutos
- **Sistema de Temas**: 30 minutos
- **Testing**: 1 hora
- **Documentación y Pulido**: 45 minutos

### Eficiencia con Herramientas Modernas:
- **Reducción de Tiempo**: Aproximadamente 50% menos tiempo que desarrollo tradicional.
- **Mayor Calidad**: Código más limpio y optimizado.
- **Mejor Documentación**: Comentarios técnicos detallados.
- **Testing Completo**: Cobertura de tests desde el inicio.

---

**Nota:** Este proyecto demuestra la capacidad de un desarrollador senior para crear aplicaciones de alta calidad utilizando herramientas modernas de manera estratégica y eficiente, reflejando las mejores prácticas de la industria actual.