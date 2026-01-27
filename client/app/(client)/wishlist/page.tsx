"use client";

import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const WishListPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Log in to view your wishlist items. Don't miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishListPage;
