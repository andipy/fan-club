import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, arrayUnion, serverTimestamp, addDoc, orderBy } from "firebase/firestore";
import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../services/firebase";

import Nav from "../components/Nav";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ThreadDetails = () => {

    const [currentUser, setCurrentUser] = useContext(AuthContext);

    const { state } = useLocation();

    const [allComments, setAllComments] = useState([]);
    const getComments = async () => {
        const collectionRef = collection(db, "posts", state.id, "comments");
        const q = query(collectionRef, orderBy("created_at", "asc"))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setAllComments(querySnapshot.docs.map((doc) => {
                return (
                    {
                        ...doc.data(),
                        id: doc.id
                    }
                )
            }));
        })
        return unsubscribe;
    }

    const [currentArtist, setCurrentArtist] = useState({});
    const getCurrentArtist = async () => {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("id", "==", state.post_author))
        const docSnap = await getDocs(q);
        setCurrentArtist(docSnap.docs[0].data());
    }

    const [users, setUsers] = useState([]);
    const getUsers = async () => {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setUsers(querySnapshot.docs.map((doc) => {
                return (
                    {
                        ...doc.data()
                    }
                )
            }));
        })
        return unsubscribe;
    }

    const [comment, setComment] = useState("");
    const handleComment = async (e) => {
        if ( comment ) {
            e.preventDefault();
            const collectionRef = collection(db, "posts", state.id, "comments");
            await addDoc(collectionRef, {
                comment: comment,
                comment_author: currentUser.uid,
                created_at: serverTimestamp()
            });
            setComment("");
        }
    }

    useEffect(()=>{
        getCurrentArtist();
        getUsers();
        getComments();
    },[]);

    return (
        <>
            <Nav />
            <div className="px-6 mx-0 pt-20 text-zinc-200">
                <div
                    className="p-4 rounded-md bg-zinc-800 text-white mt-2"
                    key={state.id}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-violet-300"></div>
                        <p>{currentArtist.username ? currentArtist.username : currentArtist.email}</p>
                    </div>
                    <div className="mt-2">
                        <p>{state.content}</p>
                    </div>
                    <div className="flex items-center justify-end w-full mt-2">
                        <p className="bg-zinc-900 text-zinc-400 p-1 rounded-full">
                            {(() => {
                                    var date = new Date(state.created_at.seconds * 1000);
                                    var hours = date.getHours();
                                    var minutes = date.getMinutes();
                                    var formattedTime = hours + ':' + minutes;
                                    return formattedTime;
                            })()}
                        </p>
                    </div>
                </div>

                <div>
                    {allComments?.map((comment) => {
                        return (
                            <div
                                className="flex mt-4"
                                key={comment.id}
                            >
                                <p className="text-violet-300 font-semibold">
                                    {users?.map((user) => {
                                        if ( user.id == comment.comment_author ) {
                                            if ( user.username ) {
                                                return user.username
                                            } else {
                                                return user.email
                                            }
                                            
                                        }
                                    })}
                                </p>
                                <p>: {comment.comment}</p>                            
                            </div>
                        )
                    })}
                </div>
            </div>

            <form onSubmit={handleComment} className="flex w-full fixed bottom-0 z-50">
                <input
                    type="text"
                    placeholder="Leave your comment bisello"
                    className="bg-zinc-700 w-full py-3 px-4 font-regular text-zinc-200"
                    onChange={(e)=>setComment(e.target.value)}
                    value={comment}
                />
                <button
                    type="submit"
                    className="px-4 bg-violet-600 text-white"
                >
                    Send
                </button>
            </form>
        </>
    )
}

export default ThreadDetails;