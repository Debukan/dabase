import React from 'react';
import SearchBar from '../components/SearchBar';
import TaskList from '../components/TaskList';

const SearchPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredTasks, setFilteredTasks] = React.useState([]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Здесь будет логика фильтрации задач на основе searchTerm
        // setFilteredTasks(фильтрованные задачи);
    };

    return (
        <div>
            <h1>Поиск задач</h1>
            <SearchBar onSearch={handleSearch} />
            <TaskList tasks={filteredTasks} />
        </div>
    );
};

export default SearchPage;