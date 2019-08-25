import React, { createContext, useContext, useReducer } from 'react'
import { initialState, reducer } from './stores/appStore'
import * as ECONSTANT from './stores/constant'

export const StateContext = createContext()
export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)
export const useStateValue = () => useContext(StateContext)
export const CONSTANT = ECONSTANT
