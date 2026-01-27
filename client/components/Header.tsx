"use client";

import React, { useEffect, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { Logs } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserButton } from "./UserButton";
import { client } from "@/sanity/lib/client";

const Header = () => {
  const { user, isSignedIn, isLoading } = useAuth();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          const query = `*[_type == "order" && clerkUserId == $userId] | order(orderDate desc)`;
          const orders = await client.fetch(query, { userId: user.id });
          setOrdersCount(orders?.length || 0);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {!isLoading && user && (
            <Link
              href={"/orders"}
              className="group relative hover:text-shop_light_green hoverEffect"
            >
              <Logs />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {ordersCount}
              </span>
            </Link>
          )}

          {!isLoading && (
            <>
              {isSignedIn && user ? <UserButton /> : <SignIn />}
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
