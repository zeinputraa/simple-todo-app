import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing todos in AsyncStorage
const TODOS_STORAGE_KEY = '@todos_data';

/**
 * Save todos to AsyncStorage
 * @param {Array} todos - Array of todo objects
 */
export const saveTodos = async (todos) => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(TODOS_STORAGE_KEY, jsonValue);
    console.log('Todos saved successfully!');
    return true;
  } catch (error) {
    console.error('Error saving todos:', error);
    return false;
  }
};

/**
 * Load todos from AsyncStorage
 * @returns {Array} Array of todo objects
 */
export const loadTodos = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
    if (jsonValue != null) {
      const todos = JSON.parse(jsonValue);
      console.log('Todos loaded successfully!');
      return todos;
    } else {
      console.log('No todos found in storage, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
};

/**
 * Clear all todos from storage
 */
export const clearTodos = async () => {
  try {
    await AsyncStorage.removeItem(TODOS_STORAGE_KEY);
    console.log('Todos cleared successfully!');
    return true;
  } catch (error) {
    console.error('Error clearing todos:', error);
    return false;
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const todos = await loadTodos();
    
    return {
      totalKeys: keys.length,
      todosCount: todos.length,
      completedTodos: todos.filter(todo => todo.completed).length,
      activeTodos: todos.filter(todo => !todo.completed).length,
      storageSize: JSON.stringify(todos).length // Approximate size in bytes
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};

/**
 * Export todos to a downloadable format
 */
export const exportTodos = async () => {
  try {
    const todos = await loadTodos();
    const exportData = {
      exportDate: new Date().toISOString(),
      totalTodos: todos.length,
      todos: todos
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting todos:', error);
    return null;
  }
};

/**
 * Import todos from JSON string
 * @param {string} jsonString - JSON string containing todos data
 */
export const importTodos = async (jsonString) => {
  try {
    const importData = JSON.parse(jsonString);
    
    if (importData && Array.isArray(importData.todos)) {
      await saveTodos(importData.todos);
      console.log('Todos imported successfully!');
      return true;
    } else {
      console.error('Invalid import data format');
      return false;
    }
  } catch (error) {
    console.error('Error importing todos:', error);
    return false;
  }
};

/**
 * Backup todos to a secondary storage key
 */
export const backupTodos = async () => {
  try {
    const todos = await loadTodos();
    const backupKey = `${TODOS_STORAGE_KEY}_backup_${Date.now()}`;
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(backupKey, jsonValue);
    console.log('Backup created successfully!');
    return backupKey;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
};

/**
 * Get all backup keys
 */
export const getBackupKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(key => key.startsWith(`${TODOS_STORAGE_KEY}_backup_`));
  } catch (error) {
    console.error('Error getting backup keys:', error);
    return [];
  }
};