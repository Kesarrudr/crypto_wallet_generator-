"use client";

import GetWalletData from "@/hooks/getaddress";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Loader from "./ui/loader";

const WalletGenerator = () => {
  const { isLoading, walletData } = GetWalletData();

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied To clipboard");
  };

  const togglePrivateVisibility = (coin: CoinType, key: keyof addressdata) => {
    setVisiblePrivateKeys((prev) => ({
      ...prev,
      [`${coin}-${key}`]: !prev[`${coin}-${key}`],
    }));
  };

  const [gridView, setGridView] = useState<boolean>(false);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{
    [key: string]: boolean;
  }>({});

  type CoinType = "Ethereum Wallet" | "Solana Wallet" | "Bitcoin Wallet";
  interface addressdata {
    "public key"?: string;
    "pirvate key"?: string;
  }
  const [pharses, setPharses] = useState("");
  const [address, setAddress] = useState<Record<CoinType, addressdata>>();
  const [showPharse, setShowPharse] = useState(false);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-4">
      {pharses && address ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="group flex flex-col items-center gap-4 cursor-pointer rounded-lg border border-primary/10 p-8"
        >
          <div
            className="flex w-full justify-between items-center"
            onClick={() => setShowPharse(!showPharse)}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
              Your Secret Phrase
            </h2>
            <Button onClick={() => setShowPharse(!showPharse)} variant="ghost">
              {showPharse ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>
          {showPharse && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="flex flex-col w-full items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full items-center mx-auto my-8"
                onClick={() => copyToClipboard(pharses)}
              >
                {mnemonic.map((word, index) => (
                  <p
                    key={index}
                    className="md:text-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 rounded-lg p-4"
                  >
                    {word}
                  </p>
                ))}
              </motion.div>

              <div
                onClick={() => copyToClipboard(pharses)}
                className="text-sm md:text-base text-primary/50 flex w-full gap-2 items-center group-hover:text-primary/80 transition-all duration-300"
              >
                <Copy className="size-4" /> Click Anywhere To Copy
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-4 my-12"
        >
          <div className="flex flex-col gap-4">
            <h1 className="tracking-tighter text-4xl md:text-5xl font-black">
              {" "}
              Secret Recovery Phrase{" "}
            </h1>
            <p className="text-primary/80 font-semibold text-lg md:text-xl">
              Save these words in safe place
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {" "}
            <Input
              type="password"
              placeholder="Enter your secret phrase (or leave blank to gnerate)"
              onChange={(e) => setPharses(e.target.value)}
              value={pharses}
            />
            <Button
              size={"lg"}
              onClick={async () => {
                const result = await walletData(pharses);
                if (result) {
                  setPharses(result.phrase);
                  setAddress(result.walletAddress);
                  setMnemonic(result.phrase.split(" "));
                }
              }}
            >
              {" "}
              Generate Wallet
            </Button>
          </div>
        </motion.div>
      )}
      <div
        className={`grid gap-6 grid-cols-1 col-span-1  ${
          gridView ? "md:grid-cols-2 lg:grid-cols-3" : ""
        }`}
      >
        {address &&
          Object.keys(address).map((coin) => (
            <motion.div
              key={coin}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="flex flex-col rounded-2xl border border-primary/10"
            >
              <div className="flex justify-between px-8 py-6">
                <h3 className="font-bold text-2xl md:text-3xl tracking-tighter">
                  {coin}
                </h3>
              </div>
              <div className="flex flex-col gap-8 px-8 py-4 rounded-2xl bg-secondary/50">
                <div className="flex flex-col w-full gap-2">
                  {Object.keys(address[coin as CoinType]).map((key) => {
                    const isPrivateKey = key === "private key";
                    const visibleKey = `${coin}-${key}`;

                    return (
                      <div key={key} className="relative">
                        <span className="text-lg md:text-xl font-bold tracking-tighter">
                          {key}
                        </span>
                        <p
                          onClick={() =>
                            copyToClipboard(
                              address[coin as CoinType][
                                key as keyof addressdata
                              ]!.toString(),
                            )
                          }
                          className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate"
                        >
                          {isPrivateKey ? (
                            <>
                              {visiblePrivateKeys[visibleKey]
                                ? address[coin as CoinType][
                                    key as keyof addressdata
                                  ]
                                : ".".repeat(100)}
                              <Button
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePrivateVisibility(
                                    coin as CoinType,
                                    key as keyof addressdata,
                                  );
                                }}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2"
                              >
                                {visiblePrivateKeys[visibleKey] ? (
                                  <EyeOff className="size-4" />
                                ) : (
                                  <Eye className="size-4" />
                                )}
                              </Button>
                            </>
                          ) : (
                            address[coin as CoinType][key as keyof addressdata]
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};
//TODO: add the copy element
export default WalletGenerator;
