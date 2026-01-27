"use client";

import Container from "@/components/Container";
// import { Metadata } from "@/actions/createCheckoutSession";
// import { createCheckoutSession } from "@/actions/createCheckoutSession";
import NoAccess from "@/components/NoAccess";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth } from "@/context/AuthContext"; // ONLY CHANGE: from @clerk/nextjs
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn, user } = useAuth(); // ONLY CHANGE: from useAuth() and useUser()
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your cart?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  // STRIPE CHECKOUT TEMPORARILY DISABLED
  const handleCheckout = async () => {
    toast.error("Payment system is temporarily disabled. Coming soon!");
    
    // setLoading(true);
    // try {
    //   const metadata: Metadata = {
    //     orderNumber: crypto.randomUUID(),
    //     customerName: user?.name ?? "Unknown", // ONLY CHANGE: from user?.fullName
    //     customerEmail: user?.email ?? "Unknown", // ONLY CHANGE: from user?.emailAddresses[0]?.emailAddress
    //     clerkUserId: user?.id,
    //     address: selectedAddress,
    //   };
    //   const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
    //   if (checkoutUrl) {
    //     window.location.href = checkoutUrl;
    //   }
    // } catch (error) {
    //   console.error("Error creating checkout session:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <Title title="Shopping cart" />
              <div className="mt-5 md:mt-10 flex flex-col lg:flex-row justify-between gap-5">
                {/* product */}
                <div className="w-full lg:w-3/5 flex flex-col gap-3">
                  <div className="bg-white p-5 rounded-md flex items-center justify-between border-b border-b-gray-300">
                    <p className="font-semibold">
                      Cart{" "}
                      <span className="text-shop_light_green">
                        ({getItemCount()}{" "}
                        {getItemCount() > 1 ? "items" : "item"})
                      </span>
                    </p>
                    <button
                      onClick={handleResetCart}
                      className="bg-gray-200 py-2 px-6 rounded-md hover:bg-red-600 hover:text-white hoverEffect font-semibold"
                    >
                      Reset cart
                    </button>
                  </div>
                  {/* Map items */}
                  <div className="flex flex-col gap-3">
                    {groupedItems?.map((item) => {
                      const imageUrl = item?.product?.image
                        ? urlFor(item?.product?.image).url()
                        : "";
                      return (
                        <div
                          key={item?.product?._id}
                          className="bg-white p-5 rounded-md flex flex-col sm:flex-row items-center gap-5 border-b-[1px] border-b-gray-300"
                        >
                          <div>
                            <Image
                              src={imageUrl}
                              alt="productImage"
                              width={200}
                              height={200}
                              className="w-28 h-28 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-5 flex-1">
                            <div className="flex-1">
                              <h2 className="text-base md:text-lg font-semibold">
                                {item?.product?.name}
                              </h2>
                              <p className="text-sm text-gray-600">
                                Unit Price $
                                {item?.product?.price?.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity {item?.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-10">
                              <p className="text-lg font-semibold text-shop_btn_dark_green">
                                $
                                {(
                                  item?.product?.price! * item?.quantity
                                ).toFixed(2)}
                              </p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() =>
                                        deleteCartProduct(
                                          item?.product?._id!
                                        )
                                      }
                                      className="text-red-600 hover:text-red-800 hoverEffect"
                                    >
                                      <Trash className="w-5 h-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete product</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Summary */}
                <div className="w-full lg:w-2/5 p-1 bg-white h-auto">
                  <Card className="border-none">
                    <CardHeader>
                      <CardTitle>Cart totals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p>Subtotal</p>
                        <p className="font-medium">
                          ${getSubTotalPrice().toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4 border-gray-300">
                        <p>Shipping</p>
                        <p className="font-medium">$0.00</p>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Total</p>
                        <p className="font-bold text-shop_btn_dark_green">
                          ${getTotalPrice().toFixed(2)}
                        </p>
                      </div>

                      {addresses && addresses?.length > 0 && (
                        <>
                          <Separator />
                          <div className="py-2">
                            <Label className="text-base font-semibold">
                              Select Delivery Address
                            </Label>
                            <RadioGroup
                              value={selectedAddress?._id || ""}
                              onValueChange={(value) => {
                                const address = addresses?.find(
                                  (addr) => addr._id === value
                                );
                                setSelectedAddress(address || null);
                              }}
                              className="mt-2 space-y-2 max-h-60 overflow-y-auto"
                            >
                              {addresses?.map((address) => (
                                <div
                                  key={address._id}
                                  className="flex items-start space-x-2 border rounded-lg p-3"
                                >
                                  <RadioGroupItem
                                    value={address._id!}
                                    id={address._id!}
                                    className="mt-1"
                                  />
                                  <Label
                                    htmlFor={address._id!}
                                    className="flex-1 cursor-pointer"
                                  >
                                    <div className="space-y-1">
                                      <p className="font-medium text-sm">
                                        {address.street}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {address.city}, {address.state},{" "}
                                        {address.zipCode}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {address.country}
                                      </p>
                                      {address.default && (
                                        <span className="text-xs text-shop_btn_dark_green font-medium">
                                          Default Address
                                        </span>
                                      )}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </>
                      )}

                      <Button
                        onClick={handleCheckout}
                        disabled={loading || !selectedAddress}
                        className="w-full bg-shop_btn_dark_green hover:bg-shop_light_green hoverEffect"
                      >
                        {loading ? "Processing..." : "Proceed to checkout"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="h-screen flex flex-col gap-5 items-center justify-center">
              <ShoppingBag className="w-32 h-32 text-gray-300" />
              <p className="text-xl font-semibold text-gray-500">
                Your shopping cart is empty
              </p>
              <Link href={"/"}>
                <Button className="bg-shop_btn_dark_green hover:bg-shop_light_green hoverEffect">
                  Continue shopping
                </Button>
              </Link>
            </div>
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;
