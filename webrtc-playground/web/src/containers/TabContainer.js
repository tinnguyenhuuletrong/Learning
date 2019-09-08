import React, { useState, useCallback } from 'react'

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [tabIndex, setTabIndex] = useState(defaultIndex)
  const setActiveIndex = useCallback(index => setTabIndex(index), [])

  return (
    <React.Fragment>
      <div className="tabs is-centered is-boxed">
        <ul>
          {tabs.map(({ name }, index) => {
            return (
              <li
                key={index}
                className={tabIndex === index ? 'is-active' : ''}
                onClick={e => setActiveIndex(index)}
              >
                <a>{name}</a>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="container">
        {tabs[tabIndex].ContentComp ? tabs[tabIndex].ContentComp : <div />}
      </div>
    </React.Fragment>
  )
}
