import React from 'react';

const TopicList: React.FC<{ topics: string[]; onSelect: (topic: string) => void }> = ({ topics, onSelect }) => {
    return (
        <div>
            <h2>Выберите тему</h2>
            <ul>
                {topics.map((topic) => (
                    <li key={topic} onClick={() => onSelect(topic)}>
                        {topic}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopicList;