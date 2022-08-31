import Layout from "./Layout";
import SignatureVerify from "./SignatureVerify";
import WalletConnectBody from "./WalletConnectBody";

const Header = () => {
  return (
    <>
      <p className="text-gray-900">Wallet Connect Playground</p>
    </>
  );
};

const Footer = () => {
  return (
    <>
      <p className="text-gray-900">TTin - Wed Aug 31 2022 11:08:57 GMT+0700 </p>
      <p>
        <a
          href="https://tailwindcss.com"
          className="text-sky-500 hover:text-sky-600"
        >
          Powered by Tailwindcss &rarr;
        </a>
      </p>
    </>
  );
};

function App() {
  return (
    <Layout
      Header={<Header />}
      Body={
        <>
          <WalletConnectBody />
          <hr />
          <SignatureVerify />
        </>
      }
      Footer={<Footer />}
    />
  );
}

export default App;
