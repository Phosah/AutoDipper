import { useWriteContract } from "wagmi";
import DipSaverABI from "../utils/abi/DipSaverABI.json";

export function useCreateDipOrder() {
  const { writeContract, isPending, error } = useWriteContract();

  const createOrder = (threshold: bigint, usdcAmount: bigint) => {
    writeContract({
      address: process.env.NEXT_PUBLIC_DIP_SAVER_ADDRESS! as `0x${string}`,
      abi: DipSaverABI,
      functionName: "createDipOrder",
      args: [threshold, usdcAmount],
    });
  };

  return { createOrder, isPending, error };
}