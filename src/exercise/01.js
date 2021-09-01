// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function Counter({initialCount = 0, step = 1}) {
  // 1, 2, 3
  // function countReducer(state, action) {
  //   return {
  //     ...state,
  //     ...(typeof action === 'function' ? action(state) : action)
  //   }
  // }

  // 4
  const countReducer = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return {...state, count: state.count + action.step}
      default: 
        return state
    }
  }

  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // 1, 2, 3
  // const [count, setCount] = React.useState(initialCount)
  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  // const {count} = state
  // const increment = () => setState({count: count + step})
  // const increment = () =>
  //   setState(currentState => ({count: currentState.count + step}))

  // 4
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  const increment = () => dispatch({type: 'INCREMENT', step})

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  // const increment = () => setCount(count + step)

  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
