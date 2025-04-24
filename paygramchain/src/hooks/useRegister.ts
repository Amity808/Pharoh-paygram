import PAYMENTABI from "@/contract/abi.json"
import ERC20Abi from "@/contract/erc20.json"
import { useCallback, useState } from "react";
import { Contract } from "ethers";
import { isSupportedNetwork } from "@/utils";
import { getEthersSigner } from "@/config/adapter";
import { useAccount, useChainId, useConfig } from "wagmi";
import { contractAddress, tokenAddress } from '@/helper/constant'
import { toast } from "react-toastify";
interface Params {
    amount: number;
    payInterval: number;
}

const useRegCompany = ({ amount, payInterval }: Params) => {
    const [isLoading, setIsLoading] = useState(false);
    const { address } = useAccount();
    const chainId = useChainId();
    const wagmiConfig = useConfig();

    const handleRegCompany = useCallback(async () => {
        setIsLoading(true);

        if (!address) {
            toast.error("Please connect your wallet");
            return;
        }

        if (!isSupportedNetwork(chainId)) {
            toast.error("Unsupported network");
            return;
        }

        const signer = await getEthersSigner(wagmiConfig);
        const giftCardContract = new Contract(contractAddress, PAYMENTABI, signer);

        try {
            const tx = await giftCardContract.registerCompany(tokenAddress as `0x${string}`, BigInt(amount ?? 0), payInterval);
            const receipt = await tx.wait();

            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            toast.success("Company created");
            return receipt;
        } catch (error) {
            console.error(error);
            toast.error("Unable to register company");
        } finally {
            setIsLoading(false);
        }
    }, [address, wagmiConfig, chainId, amount, payInterval]);

    return {
        handleRegCompany,
        isLoading
    };
};

export default useRegCompany;