import React, { useState, useEffect, useRef } from 'react';
import "./autocompletestyle.css";

export const AutocompleteInput = ({
                                      value,
                                      onChange,
                                      suggestions = [],
                                      placeholder = "Введите значение...",
                                      label,
                                      required = false,
                                      id,
                                      name
                                  }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (newValue.trim() === '') {
            setFilteredSuggestions(suggestions.slice(0, 10));
        } else {
            const filtered = suggestions
                .filter(suggestion =>
                    suggestion.toLowerCase().includes(newValue.toLowerCase())
                )
                .slice(0, 10);
            setFilteredSuggestions(filtered);
        }

        setShowSuggestions(true);
        setSelectedSuggestionIndex(-1);

        if (onChange) {
            onChange({
                target: {
                    name,
                    value: newValue
                }
            });
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setShowSuggestions(false);

        if (onChange) {
            onChange({
                target: {
                    name,
                    value: suggestion
                }
            });
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev =>
                    prev < filteredSuggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < filteredSuggestions.length) {
                    handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
                } else if (inputValue.trim() !== '') {
                    setShowSuggestions(false);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    const handleFocus = () => {
        setFilteredSuggestions(suggestions.slice(0, 10));
        setShowSuggestions(true);
    };

    return (
        <div className="autocomplete-container" ref={containerRef}>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                ref={inputRef}
                type="text"
                id={id}
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                placeholder={placeholder}
                required={required}
                className="autocomplete-input"
                autoComplete="off"
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="suggestions-list">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={`${suggestion}-${index}`}
                            className={`suggestion-item ${
                                index === selectedSuggestionIndex ? 'selected' : ''
                            }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}

            {showSuggestions && filteredSuggestions.length === 0 && inputValue.trim() !== '' && (
                <div className="no-suggestions">
                    <p>Совпадений не найдено</p>
                    <small>Нажмите Enter, чтобы сохранить "{inputValue}"</small>
                </div>
            )}
        </div>
    );
};