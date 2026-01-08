import React from "react";
import "./App.css";

import NotFound from './404/error'; // The 404 component

import LoginForm from "./auth/login/login";
import Mail from './auth/register/mail'
import Auth from './auth/auth/auth'
import Forgot from './auth/forgot/forgot'
import Reset from './auth/reset/reset';

import Home from './page/home/home';
import Uploadproduct from './page/upload/upload';
import ProductInfo from './page/product/item';
import SearchItem from './page/search/search';
import Category from './page/category/category';
import ListedOffer from './page/offer/list';
import TypeOffer from './page/offer/project';
import Employ from './page/employ/employ';
import Pannel from './page/admin/pannel';
import UserToAdmin from './page/chat/chat';
import AdminToChat from './page/chat/admin';
import PlaceOrder from './page/order/place';

import Mainseller from './page/seller/main';


import { BrowserRouter,
        Route,
        Routes 
       } from 'react-router-dom';


function App() {
   return (
      <BrowserRouter>
        <Routes>
            <Route exact path="/auth/:code/:type/:otp" element={<Auth />}></Route>
            <Route exact path="/reset/:code/:forgot" element={<Reset />}></Route>
            <Route exact path="/forgot" element={<Forgot />}></Route>
            <Route exact path="/login" element={<LoginForm />}></Route>
            <Route exact path="/register" element={<Mail />}></Route>
            <Route exact path="/contact" element={<UserToAdmin/>}></Route>
            <Route exact path='/admin/chat' element={<AdminToChat/>}></Route>
            <Route exact path="/" element={<Home/>}></Route>
            <Route exact path="/product" element={<ProductInfo/>}></Route>
            <Route exact path="/search" element={<SearchItem/>}></Route>
            <Route exact path="/category/:type" element={<Category/>}></Route>
            <Route exact path="/offer" element={<ListedOffer/>}></Route>
            <Route exact path="/offer/:id" element={<TypeOffer/>}></Route>
            <Route exact path="/upload-product" element={<Uploadproduct/>}></Route>
            <Route exact path="/admin/pannel" element={<Pannel/>}></Route>
            <Route exact path="/employment" element={<Employ/>}></Route>
            <Route exact path="/placeorder/:id" element={<PlaceOrder/>}></Route>
            <Route exact path="/seller" element={<Mainseller/>}></Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
