import React from 'react';
import {useStateValue} from '../../AppContext';

export default ({expectedAppStep, children}) => {
  const [{appStep}] = useStateValue();
  const check = Array.isArray(expectedAppStep)
    ? expectedAppStep
    : [expectedAppStep];
  return (
    <React.Fragment>{check.includes(appStep) ? children : null}</React.Fragment>
  );
};
