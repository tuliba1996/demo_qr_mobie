import { Container, Stack, Image, Button, Center } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { useEffect, useState } from "react";
import { providerOptions } from "../src/providerOptions";
import { ethers } from "ethers";

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
  });
}

const ShowQr = () => {
  const router = useRouter();
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const refreshState = () => {
    setAccount(null);
    setChainId(null);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <Container>
      <Stack direction="row" spacing={4} margin="1rem">
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="teal"
          variant="outline"
          onClick={() => router.push("/")}
        >
          Back
        </Button>
      </Stack>
      <Stack direction="row" marginY="3rem" justifyContent="center">
        <Image
          boxSize="300px"
          objectFit="cover"
          src="../../qrcode.png"
          alt="Dan Abramov"
        />
      </Stack>
      <Stack>
        {!account ? (
          <Button onClick={connectWallet} colorScheme="teal" variant="outline">
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button onClick={disconnect} colorScheme="teal" variant="outline">
              Disconnect Wallet
            </Button>
            <p style={{ marginTop: "2rem" }}>Account Address: {account}</p>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default ShowQr;
