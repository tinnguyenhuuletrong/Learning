import React, { useCallback, useEffect, useRef, useState } from "react";
import { utils } from "ethers";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

interface IWalletConnectStore {
  connector: WalletConnect;
  walletAddress?: string;
  chainId?: string;
  state: "waiting" | "connected" | "disconnected" | "error";
  signMessage: (msg: string) => Promise<any>;
  reset: () => Promise<void>;
}

function useWalletConnect() {
  const [connector, setConnector] = useState<IWalletConnectStore>();
  useEffect(() => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
      clientMeta: {
        description: "Test Sign",
        url: window.location.href,
        icons: [
          "https://nybgevents.com/wp-content/uploads/2018/07/project-test-logo-300x193.png",
        ],
        name: "Test Signer",
      },
    });

    const baseState: IWalletConnectStore = {
      connector,
      state: "waiting",
      signMessage: (message: string) => {
        const signParams = [
          baseState.walletAddress,
          utils.keccak256(
            utils.toUtf8Bytes(
              "\x19Ethereum Signed Message:\n" + message.length + message
            )
          ),
        ];
        return connector?.signMessage(signParams);
      },
      reset: async () => {
        connector.killSession();
        localStorage.removeItem("walletconnect");
        window.location.reload();
      },
    };

    if (connector.connected) {
      baseState.state = "connected";
      baseState.walletAddress = connector.accounts[0];
      baseState.chainId = connector.chainId.toString();
    }

    setConnector({
      ...baseState,
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];

      baseState.walletAddress = accounts[0];
      baseState.chainId = chainId;

      setConnector({
        ...baseState,
        state: "connected",
      });
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];

      baseState.walletAddress = accounts[0];
      baseState.chainId = chainId;

      setConnector({
        ...baseState,
        state: "connected",
      });
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        console.error(error);
      }

      // Delete connector

      baseState.walletAddress = undefined;
      baseState.chainId = undefined;

      setConnector({
        ...baseState,
        state: "disconnected",
      });
    });
  }, []);

  return [connector];
}

export default function WalletConnectBody() {
  const [connector] = useWalletConnect();
  const [inpMessage, setIntMessage] = useState<string>();
  const [signRes, setSignRes] = useState<string>();
  const onSign = useCallback(async () => {
    if (!connector?.connector) return;
    try {
      const res = await connector.signMessage("hello");
      console.log(res);
      setSignRes(res);
    } catch (error: any) {
      setSignRes(error.message);
    }
  }, [connector, setSignRes]);

  const onReset = useCallback(async () => {
    if (!connector?.connector) return;
    const res = await connector.reset();
  }, [connector, setSignRes]);
  return (
    <>
      <div>
        <p>
          State: <span className="font-bold uppercase">{connector?.state}</span>
        </p>
        <p>
          Address:{" "}
          <span className="font-bold uppercase">
            {connector?.walletAddress}
          </span>
        </p>
        <p>
          ChainID:{" "}
          <span className="font-bold uppercase">{connector?.chainId}</span>
        </p>
      </div>
      {connector?.state === "connected" && (
        <>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700">
              Message:
            </span>
            <input
              type="text"
              className="form-input rounded text-pink-500"
              value={inpMessage}
              onChange={(v) => setIntMessage(v.target.value)}
            />
          </label>

          <p>
            Click button below to sign message:{" "}
            <span className=" font-semibold">{inpMessage}</span>
          </p>

          <div className=" flex justify-end">
            <button
              className="peer bg-blue-200 p-2 rounded font-medium"
              disabled={!inpMessage}
              onClick={onSign}
            >
              Sign
            </button>

            <button
              className="peer bg-pink-200 p-2 rounded font-medium ml-3 "
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        </>
      )}
      <p>
        Result: <span className="font-bold uppercase break-all">{signRes}</span>
      </p>
    </>
  );
}
