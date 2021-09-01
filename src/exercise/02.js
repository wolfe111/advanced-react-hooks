// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useSafeDispatch(unsafeDispatch) {
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    mountedRef.current = true
    return () => mountedRef.current = false
  })

  return React.useCallback((...args) => {
    if(mountedRef.current) {
      unsafeDispatch(...args)
    }
  }, [unsafeDispatch])
}


function useAsync(initalState) {
  const [data, unsafeDispatch] = React.useReducer(asyncReducer, {
    // status: status.status ? 'pending' : 'idle',
    // 🐨 this will need to be "data" instead of "pokemon"
    status: 'idle',
    data: null,
    error: null,
    ...initalState,
  })

  const dispatch = useSafeDispatch(unsafeDispatch)

  const run = React.useCallback((promise) => {
    // console.log('ahhh', asyncFunc)
    console.log('promise', promise)
    if (!promise) {
      return
    }
    // then you can dispatch and handle the promise etc...
    dispatch({type: 'pending'})
  
    promise.then(
      data => {
        console.log('ahhhhh', data)
        dispatch({type: 'resolved', data})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  }, [dispatch])


  // React.useEffect(() => {
    // console.log(asyncCallback)
    // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
    // const promise = asyncCallback()
  //   console.log('promise', promise)
  //   if (!promise) {
  //     return
  //   }
  //   // then you can dispatch and handle the promise etc...
  //   dispatch({type: 'pending'})
  
  //   promise.then(
  //     data => {
  //       console.log('ahhhhh', data)
  //       dispatch({type: 'resolved', data})
  //     },
  //     error => {
  //       dispatch({type: 'rejected', error})
  //     },
  //   )
  //   // 🐨 you'll accept dependencies as an array and pass that here.
  //   // 🐨 because of limitations with ESLint, you'll need to ignore
  //   // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  // }, [])



  return {...data, run}

}

function PokemonInfo({pokemonName}) {
  // 🐨 move both the useReducer and useEffect hooks to a custom hook called useAsync
  // here's how you use it:

  // const asyncCallback = React.useCallback(() => {
  //   if (!pokemonName) {
  //     return
  //   }
  //   return fetchPokemon(pokemonName)
  // }, [pokemonName])

  // const state = useAsync(
  //   asyncCallback,
  //   {status: pokemonName ? 'pending' : 'idle'}
  // )
  // 🐨 so your job is to create a useAsync function that makes this work.

  // 🐨 this will change from "pokemon" to "data"
  const {data, status, error, run} = useAsync({status: pokemonName ? 'pending' : 'idle',
})


  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    console.log('woo')
    run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={data} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
