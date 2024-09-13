import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const GetWalletData = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const walletData = async (mnemonic?: string) => {
    setisLoading(true);
    try {
      const response = await axios.post(
        "https://wallet-backend.kesartechnologies.software/generate",
      );
      if (response.status === 200) {
        toast.success("Wallet Generated Successfully");
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`${error.response.data.message}`);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          toast.error("Error: No response received from the server.");
          console.error("Request data:", error.request);
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error("Unexpected error occurred.");
      }
      return null;
    } finally {
      setisLoading(false);
    }
  };

  return { isLoading, walletData };
};

export default GetWalletData;
