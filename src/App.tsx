import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'

import './App.scss'

const numRows = 30
const numCols = 30

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
]

const generateEmptyGrid = () => {
    const rows = []
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0))
        // if (i === 6) {
        //     rows[0][6] = 1
        // }
    }

    return rows
}

const App: React.FC = () => {
    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid()
    })

    const [running, setRunning] = useState(false)

    const [value, setValue] = useState(200)

    const runningRef = useRef(running)
    runningRef.current = running

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return
        }

        setGrid(g => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        let neighbors = 0
                        operations.forEach(([x, y]) => {
                            const newI = i + x
                            const newK = k + y

                            if (
                                newI >= 0 &&
                                newI < numRows &&
                                newK >= 0 &&
                                newK < numCols
                            ) {
                                neighbors += g[newI][newK]
                            }
                        })

                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k] = 0
                        } else if (g[i][k] === 0 && neighbors === 3) {
                            gridCopy[i][k] = 1
                        }
                    }
                }
            })
        })

        setTimeout(runSimulation, value)
    }, [])

    return (
        <div
            className="wrapper"
            style={
                running
                    ? { animation: '2s scrollFast infinite linear' }
                    : { animation: '5s scrollNormal infinite linear' }
            }
        >
            <header>
                <div className="logo">LOGO</div>
                <div className="right-buttons">
                    <button>Inspiration</button>
                    <button>Creator</button>
                </div>
            </header>
            <div className="buttons-wrapper">
                <button
                    onClick={() => {
                        setRunning(!running)
                        if (!running) {
                            runningRef.current = true
                            runSimulation()
                        }
                    }}
                >
                    {running ? 'STOP' : 'START'}
                </button>
                <button
                    onClick={() => {
                        setGrid(generateEmptyGrid())
                    }}
                >
                    CLEAR
                </button>
                <button
                    onClick={() => {
                        const rows = []
                        for (let i = 0; i < numRows; i++) {
                            rows.push(
                                Array.from(Array(numCols), () =>
                                    Math.random() > 0.7 ? 1 : 0
                                )
                            )
                        }

                        setGrid(rows)
                    }}
                >
                    RANDOM
                </button>
            </div>
            <div className="grid-outter">
                <div className="grid-inner">
                    <div
                        className="grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${numCols}, 1vw`
                        }}
                    >
                        {grid.map((rows, i) =>
                            rows.map((col, k) => (
                                <div
                                    key={`${i}-${k}`}
                                    onClick={() => {
                                        const newGrid = produce(
                                            grid,
                                            gridCopy => {
                                                gridCopy[i][k] = grid[i][k]
                                                    ? 0
                                                    : 1
                                            }
                                        )
                                        setGrid(newGrid)
                                    }}
                                    className={
                                        'grid-element ' +
                                        (grid[i][k] ? 'active' : '')
                                    }
                                ></div>
                            ))
                        )}
                    </div>
                    <div className="pattern-selector-outter">
                        <div className="title">Select a pattern</div>
                        <div className="pattern-selector-inner">
                            <div className="pattern">
                                <div className="name">Pattern #1</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
