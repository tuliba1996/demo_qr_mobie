import { QrReader } from "react-qr-reader";
import { useState } from "react";
import { Button, Center, Container, Stack } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const ScanQr = () => {
  const [data, setData] = useState("");

  const router = useRouter();

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
      <QrReader
        delay={1000}
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }
          if (!!error) {
            console.info(error);
          }
        }}
        constraints={{ facingMode: "environment" }}
        containerStyle={{
          width: "100%",
          padding: "5%",
          background: "gray",
        }}
      />
      <Center>{data !== "" && <p>{data}</p>}</Center>
    </Container>
  );
};

export default ScanQr;
