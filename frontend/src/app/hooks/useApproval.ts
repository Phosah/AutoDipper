import {useWriteContract} from 'wagmi';
import ERC20ABI from '../utils/abi/ERC20ABI.json';

export function useApproveUsdc() {
    const {writeContract, isPending, error}  = useWriteContract();

    const approve = (amount: bigint) => {
        writeContract({
            address: process.env.NEXT_PUBLIC_USDC_ADDRESS! as `0x${string}`,
            abi: ERC20ABI,
            functionName: "approve",
            args: [process.env.NEXT_PUBLIC_DIP_SAVER_ADDRESS!, amount],
        });
    };

    return { approve, isPending, error };
}