import React, { useCallback, useEffect } from 'react'
import DisplayIfStep from '../containers/DisplayIfStep'
import { useStateValue, CONSTANT } from '../AppContext'

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ appStep, mode, roomId, connection }, dispatch] = useStateValue()

  useEffect(() => {
    const pageUnload = () => {
      dispatch({
        type: CONSTANT.EACTION.reset
      })
    }
    window.addEventListener('beforeunload', pageUnload, false)
    return () => {
      window.removeEventListener('beforeunload', pageUnload)
    }
  }, [dispatch, connection])

  // Set app mode
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

  const onReset = useCallback(() => {
    connection && connection.destroy && connection.destroy()
    dispatch({
      type: CONSTANT.EACTION.reset
    })
  }, [dispatch, connection])

  // Set room Id
  const updateRoomId = useCallback(
    roomId => {
      dispatch({
        type: CONSTANT.EACTION.setRoomId,
        value: roomId
      })
    },
    [dispatch]
  )
  const stepLock =
    appStep === CONSTANT.ESTEP.CHOICE_MODE
      ? { disabled: false }
      : { disabled: true }

  return (
    <div className="columns is-multiline is-centered">
      <div className="column is-6">
        <fieldset {...stepLock}>
          <input
            className="input is-rounded"
            type="text"
            value={roomId}
            onChange={e => updateRoomId(e.target.value)}
            placeholder="Room Id"
          />
        </fieldset>
      </div>
      <div className="column is-full">
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
      </div>
      <div className="column">
        <div className="field is-grouped is-grouped-centered">
          <DisplayIfStep
            expectedAppStep={[
              CONSTANT.ESTEP.CONNECTED,
              CONSTANT.ESTEP.DISCONNECT,
              CONSTANT.ESTEP.NOT_CONNECT
            ]}
          >
            <button className="button is-warning" onClick={onReset}>
              Reset
            </button>
          </DisplayIfStep>
        </div>
      </div>
    </div>
  )
}