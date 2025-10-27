import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <View style={[styles.container, todo.completed && styles.completed]}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => onToggle(todo.id)}
      >
        <Text style={styles.checkboxText}>
          {todo.completed ? '✓' : ''}
        </Text>
      </TouchableOpacity>
      
      <Text style={[styles.text, todo.completed && styles.completedText]}>
        {todo.text}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDelete(todo.id)}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  completed: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  checkboxText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 18,
  },
});

export default TodoItem;