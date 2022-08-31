import { utils } from "ethers";

export function validatePersonalSignature({
  sig,
  rawMessage,
  address,
}: {
  sig: string;
  rawMessage: string;
  address: string;
}) {
  const res = utils.verifyMessage(rawMessage, sig);
  const checksumAddress = utils.getAddress(address);
  return res === checksumAddress;
}
