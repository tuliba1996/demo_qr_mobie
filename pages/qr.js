import { Container, Stack, Image, Button, Center } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { chain } from "wagmi";

const ShowQr = () => {
  const router = useRouter();

  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new MetaMaskConnector({
      chains: [chain.mainnet, chain.optimism],
    }),
  });

  const { disconnect } = useDisconnect();

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
            <p style={{ marginTop: "2rem" }}>Account Address: {address}</p>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default ShowQr;
