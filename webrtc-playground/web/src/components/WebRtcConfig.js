import React, { useEffect, useState } from "react";

export default ({ onChange }) => {
  const [configJson, setConfig] = useState(`{
    "trickle": true,
    "config": {
      "iceServers": [ { "urls": "stun:stun.l.google.com:19302" }, { "urls": "stun:global.stun.twilio.com:3478?transport=udp" }, { "urls": "turn:numb.viagenie.ca", "username": "ilu20009@gmail.com", "credential":"Abc12345" } ]
    }
  }`);
  const [isCorrect, setIsCorrect] = useState(true);

  // Init value
  useEffect(() => {
    onChange && onChange(JSON.parse(configJson));
  }, []);

  return (
    <div className="field">
      <label className="label">
        STUN/TURN config{" "}
        <span
          className={[
            "icon",
            isCorrect ? "has-text-success" : "has-text-danger"
          ].join(" ")}
        >
          <i
            className={["fas", isCorrect ? "fa-check" : "fa-ban"].join(" ")}
          ></i>
        </span>
      </label>
      <div className={["control"].join(" ")}>
        <textarea
          className={["textarea", "is-small"].join(" ")}
          defaultValue={configJson}
          onChange={e => {
            try {
              setConfig(e.target.value);
              const newVal = JSON.parse(e.target.value);
              onChange && onChange(newVal);
              setIsCorrect(true);
            } catch (error) {
              setIsCorrect(false);
            }
          }}
        />
      </div>
    </div>
  );
};
