import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from '../services/firebase';
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Artists = () => {

    const [currentUser, setCurrentUser] = useContext(AuthContext);

    const navigate = useNavigate();

    const [artists, setArtists] = useState([]);

    const getArtists = async () => {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("role", "==", "ARTIST"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setArtists(querySnapshot.docs.map((doc) => {
                return (
                    {
                        ...doc.data()
                    }
                )
            }));
        })
        return unsubscribe;
    }
    useEffect(()=>{
        getArtists();
    },[]);

    return (
        <div className="px-6 mx-0 pt-20 text-zinc-200">
            {artists?.map((artist) => {
                return (
                    <div
                        className="p-8 bg-zinc-800 rounded-md mb-2"
                        onClick={() => navigate(`/${artist.uid}`, { state: artist })}
                        key={artist.id}
                    >
                        <p>{artist.username ? artist.username : artist.email}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Artists;