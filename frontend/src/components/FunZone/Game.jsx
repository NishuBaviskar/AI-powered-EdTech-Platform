import { useState } from 'react';
import Card from '../UI/Card';

const Square = ({ value, onSquareClick }) => {
    return (
        <button 
            className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-4xl font-bold"
            onClick={onSquareClick}
        >
            {value === 'X' ? <span className="text-blue-500">X</span> : <span className="text-red-500">O</span>}
        </button>
    );
};

const Game = () => {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (i) => {
        if (squares[i] || calculateWinner(squares)) return;
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    };

    const winner = calculateWinner(squares);
    const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;
    
    return (
        <Card title="Quick Game: Tic-Tac-Toe">
            <div className="flex flex-col items-center justify-center p-4">
                <div className="text-lg font-semibold mb-4">{status}</div>
                <div className="grid grid-cols-3 gap-2">
                    {squares.map((_, i) => (
                        <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
                    ))}
                </div>
                <button onClick={() => setSquares(Array(9).fill(null))} className="mt-6 px-4 py-2 bg-primary text-white text-sm rounded-md">
                    Reset Game
                </button>
            </div>
        </Card>
    );
};

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default Game;