import React from 'react';
import { BiCheck } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

export default function OfferList({ offers, addOffer, tick, setTick}) {

    return (
      <div>
        {offers.map((offer, i) => (
          <div
            className="list-items-br-pr"
            id={`${offer.id}items-pr`}
            key={i}
          >
            <h2>{offer.title}</h2>
            <p>get ₹{offer.price} extra discount</p>
            { tick[i] === false ? 
                   <BiCheck className="tik-if-want-pr" id={`offer-${offer.id}-pr`} onClick={() => addOffer(offer.id, i, 'add')}/>
                 : <IoClose className="tik-if-want-pr" id={`offer-${offer.id}-pr`} onClick={() => addOffer(offer.id, i, 'remove')}/>
            }
          </div>
        ))}
      </div>
    );
  };
