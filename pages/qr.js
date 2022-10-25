import { Container, Stack, Image, Button, Center } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import {
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import { chain } from "wagmi";

import ERC721ABI from "../src/ERC-721.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const ShowQr = () => {
  const router = useRouter();

  const { address, isConnected } = useAccount();

  const [tokenIds, setTokenIds] = useState([]);

  const [tokenId, setTokenId] = useState();

  const [timeSign, setTimeSign] = useState(0);
  const contract = useContract({
    address: "0xfF646D99fB94bb20439429c8fe0EE2F58090FA14",
    abi: ERC721ABI,
    signerOrProvider: new ethers.providers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545"
    ),
  });

  useEffect(() => {
    if (address) {
      contract.balanceOf(address).then((balanceOf) => {
        Promise.all(
          Array.from({ length: balanceOf.toNumber() }, (_, i) => {
            return contract.tokenOfOwnerByIndex(address, i);
          })
        ).then((tokenIds) => {
          setTokenIds(tokenIds.map((tokenId) => tokenId.toNumber()));
        });
      });
    }
  }, [address]);

  const { connect } = useConnect({
    connector: new MetaMaskConnector({
      chains: [chain.mainnet, chain.optimism],
    }),
  });

  const { disconnect } = useDisconnect();

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();

  const SignMessage = async (id) => {
    const timestamp = Math.floor(Date.now() / 1000);
    setTimeSign(timestamp);
    setTokenId(id);

    signMessage({ message: `${id.toString()}::${timestamp.toString()}` });
  };

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
        {data && (
          <div style={{ background: "white", padding: "16px" }}>
            <QRCode value={`${address}::${tokenId}::${data}::${timeSign}`} />
          </div>
        )}
      </Stack>
      <Stack>
        {!isConnected ? (
          <Button
            onClick={() => connect()}
            colorScheme="teal"
            variant="outline"
          >
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button
              onClick={() => disconnect()}
              colorScheme="teal"
              variant="outline"
            >
              Disconnect Wallet
            </Button>
            <div>
              {address && (
                <p style={{ marginTop: "2rem" }}>Account Address: {address}</p>
              )}
              {tokenIds.map((tokenId) => (
                <div key={tokenId}>
                  Token ID: {tokenId}
                  <Button onClick={() => SignMessage(tokenId)}>Sign</Button>
                </div>
              ))}
            </div>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default ShowQr;
