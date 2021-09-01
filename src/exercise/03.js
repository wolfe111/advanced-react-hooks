// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// 🐨 create your CountContext here with React.createContext
const CountContext = React.createContext()

// 🐨 create a CountProvider component here that does this:
//   🐨 get the count state and setCount updater with React.useState
//   🐨 create a `value` array with count and setCount
//   🐨 return your context provider with the value assigned to that array and forward all the other props
//   💰 more specifically, we need the children prop forwarded to the context provider

function CountProvider({children}) {
  const countState = React.useState(0)

  return <CountContext.Provider value={countState}>{children}</CountContext.Provider>
}

function useCount() {
  const context = React.useContext(CountContext)

  if (context === undefined) {
    throw Error('useCount must be used within a CountProvider')
  }

  return context
}

function CountDisplay() {
  // 🐨 get the count from useContext with the CountContext
  const [count] = useCount()
  // const count = 0
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 get the setCount from useContext with the CountContext
  const [, setCount] = React.useContext(CountContext)

  // const setCount = () => {}
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
      <CountProvider>
        {/*
        🐨 wrap these two components in the CountProvider so they can access
        the CountContext value
      */}
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
