import React, { useCallback, useMemo } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ appStep, mode }, dispatch] = useStateValue()

  const setMode = useCallback(
    mode => {
      dispatch({
        type: CONSTANT.EACTION.setAppMode,
        value: mode
      })
      dispatch({
        type: CONSTANT.EACTION.setAppStep,
        value: CONSTANT.ESTEP.NOT_CONNECT
      })
    },
    [dispatch]
  )

  const stepLock = useMemo(
    () => (appStep === CONSTANT.ESTEP.CHOICE_MODE ? {} : { disabled: true }),
    [appStep]
  )

  return (
    <fieldset {...stepLock}>
      <div className="field is-grouped is-grouped-centered">
        <label className="radio">
          <input
            type="radio"
            checked={mode === CONSTANT.ECLIENT_MODE.HOST}
            onChange={e => setMode(CONSTANT.ECLIENT_MODE.HOST)}
          />
          <span style={{ margin: 5 }}>Host</span>
        </label>
        <label className="radio">
          <input
            type="radio"
            checked={mode === CONSTANT.ECLIENT_MODE.PEER}
            onChange={e => setMode(CONSTANT.ECLIENT_MODE.PEER)}
          />
          <span style={{ margin: 5 }}>Peer</span>
        </label>
      </div>
    </fieldset>
  )
}
