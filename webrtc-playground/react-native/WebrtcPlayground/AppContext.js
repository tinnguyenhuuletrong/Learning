import React, {createContext, useContext, useReducer} from 'react';
import {initialState, reducer} from './src/stores/appStore';
import * as ECONSTANT from './src/stores/constant';

export const StateContext = createContext();
window.store = initialState;
export const StateProvider = ({children}) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);
export const CONSTANT = ECONSTANT;
