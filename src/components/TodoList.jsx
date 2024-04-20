import React, { useState, useEffect } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedValue, setEditedValue] = useState('');

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((data) => {
                const initialTodos = data.slice(0, 5).map((todo) => ({
                    text: todo.title,
                    complete: todo.completed,
                }));
                setTodos(initialTodos);
            })
            .catch((error) => {
                console.error('Error fetching todos:', error);
            });
    }, []);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddTodo = () => {
        if (inputValue.trim() !== '') {
            setTodos([{ text: inputValue, complete: false }, ...todos]);
            setInputValue('');
        }
    };

    const handleDeleteTodo = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
        setEditingIndex(null);
    };

    const handleToggleComplete = (index) => {
        setTodos(
            todos.map((todo, i) =>
                i === index ? { ...todo, complete: !todo.complete } : todo
            )
        );
    };

    const handleEditTodo = (index) => {
        setEditingIndex(index);
        setEditedValue(todos[index].text);
    };

    const handleSaveEdit = (index) => {
        const newTodos = [...todos];
        newTodos[index].text = editedValue;
        setTodos(newTodos);
        setEditingIndex(null);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
    };

    return (
        <div className="container">
            {/* Navbar */}
            <div className="navbar">
                <h1>Todo List</h1>
            </div> 

            {/* Main Content */}
            <div className="main-content">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Enter your todo"
                />
                <button onClick={handleAddTodo}>Add Todo</button>
                <ul className="todo-list">
                    {todos.map((todo, index) => (
                        <li className="todo-item" key={index}>
                            <input
                                type="checkbox"
                                checked={todo.complete}
                                onChange={() => handleToggleComplete(index)}
                            />
                            {editingIndex === index ? (
                                <>
                                    <input
                                        type="text"
                                        value={editedValue}
                                        onChange={(e) => setEditedValue(e.target.value)}
                                    />
                                    <button onClick={() => handleSaveEdit(index)}>Save</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span className={todo.complete ? 'completed' : ''}>
                                        {todo.text}
                                    </span>
                                    <button onClick={() => handleEditTodo(index)}>Edit</button>
                                    <button
                                        onClick={() => handleDeleteTodo(index)}
                                        disabled={!todo.complete}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TodoList;