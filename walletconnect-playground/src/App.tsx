import Layout from "./Layout";
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
      <p className="text-gray-900">TTin - 2022</p>
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
      Body={<WalletConnectBody />}
      Footer={<Footer />}
    />
  );
}

export default App;
