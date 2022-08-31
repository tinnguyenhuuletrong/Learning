import React, { useCallback, useEffect, useRef, useState } from "react";
import { utils } from "ethers";
import { validatePersonalSignature } from "./ethPersonalSignValidator";

export default function SignatureVerify() {
  const [sig, setSig] = useState<string>();
  const [msg, setMsg] = useState<string>();
  const [signedByAddress, setSignedByAddress] = useState<string>();
  const [verifyRes, setVerifyRes] = useState<string>();
  const onVerifySig = useCallback(async () => {
    if (!(sig && msg && signedByAddress)) return;

    try {
      const res = validatePersonalSignature({
        sig: sig.toLowerCase(),
        rawMessage: msg,
        address: signedByAddress.toLowerCase(),
      });
      setVerifyRes(`${res}`);
    } catch (error: any) {
      setVerifyRes(error.message);
    }
  }, [sig, msg, signedByAddress, setVerifyRes]);

  return (
    <>
      <div>
        <p className="block">
          <span className="font-bold uppercase">
            Verify personal signed message
          </span>
        </p>

        <label className="block mt-5">
          <span className=" text-slate-700 my-2 mr-4">Address:</span>
          <input
            type="text"
            className="form-input rounded-full text-purple-500 border-purple-200 drop-shadow-md"
            value={signedByAddress}
            onChange={(v) => setSignedByAddress(v.target.value)}
          />
        </label>

        <label className="block mt-5">
          <span className=" text-slate-700 my-2 mr-4">Message:</span>
          <input
            type="text"
            className="form-input rounded-full text-purple-500 border-purple-200 drop-shadow-md"
            value={msg}
            onChange={(v) => setMsg(v.target.value)}
          />
        </label>

        <label className="block mt-4">
          <span className=" text-slate-700 my-2 mr-4">Signature:</span>
          <textarea
            className="form-input text-purple-500 border-purple-200 drop-shadow-md w-full h-20"
            value={sig}
            onChange={(v) => setSig(v.target.value)}
          />
        </label>
      </div>

      <div className=" flex justify-end space-x-3">
        <button
          type="submit"
          className="
                
                transition
                px-6 p-2 
                rounded-full font-medium  
                drop-shadow-md bg-blue-200 
                hover:bg-blue-400 
                hover:cursor-pointer
                focus:ring focus:ring-blue-300
                
                disabled:opacity-75
                disabled:bg-gray-300
              "
          disabled={!(signedByAddress && sig)}
          onClick={onVerifySig}
        >
          Verify
        </button>
      </div>
      <p>
        Result:{" "}
        <span className="font-bold uppercase break-all">
          {verifyRes || "-"}
        </span>
      </p>
      <hr />
      <p>
        <span className="font-bold uppercase">Code</span>
        <span className="block break-all mt-3">
          Solidity:{" "}
          <a
            href="https://gist.github.com/tinnguyenhuuletrong/9b0ee54df0757125369f8e3edb4f7428"
            target="_blank"
            className="text-indigo-300"
          >
            Verify_Personal_Sign_Signature.sol
          </a>
        </span>
        <span className="block break-all mt-3">
          EtherJs:{" "}
          <a
            href="https://gist.github.com/tinnguyenhuuletrong/b14dcf53eaee3c925be2ec4f4c987f70"
            target="_blank"
            className="text-indigo-300"
          >
            Verify_Personal_Sign_Signature.ts
          </a>
        </span>
      </p>
    </>
  );
}
