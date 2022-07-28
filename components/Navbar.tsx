import { Button, Card, Col, Loading, Row, Text } from "@nextui-org/react";
import { utils } from "near-api-js";
import Link from "next/link";
import useAuthContext from "../context/AuthContext";
import useNearContext from "../context/NearContext";
import useBalanceQuery from "../queries/useBalanceQuery";

export default function Navbar() {
  const { accountId } = useNearContext();
  const { isSignedIn, signOut, signIn } = useAuthContext();
  const { data: balance, isLoading } = useBalanceQuery();

  return (
    <Row justify="space-between" align="center">
      <Col span={18}>
        <Row align="baseline">
          <Link href="/">
            <Text
              h2
              css={{
                textGradient: "45deg, $blue600 -20%, $pink600 50%",
                cursor: "pointer",
              }}
            >
              Rock Paper Scissors
            </Text>
          </Link>
          <Text css={{ ml: "$4" }} color="default" h5>
            on Near
          </Text>
        </Row>
      </Col>
      <Col css={{ display: "flex", justifyContent: "flex-end" }}>
        {isSignedIn() ? (
          <>
            <Button auto css={{ mr: "$5" }} ghost disabled>
              {accountId}
            </Button>

            <Button auto css={{ mr: "$5" }} ghost disabled>
              {isLoading && <Loading />}
              {!isLoading && (
                <Text>
                  {utils.format.formatNearAmount(balance?.available || "0", 2)}{" "}
                  N
                </Text>
              )}
            </Button>

            <Button color="gradient" onClick={() => signOut()} auto ghost>
              Sign out
            </Button>
          </>
        ) : (
          <Button color="gradient" onClick={() => signIn()} auto>
            Sign in
          </Button>
        )}
      </Col>
    </Row>
  );
}
