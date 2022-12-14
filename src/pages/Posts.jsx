import { collection, query, where, onSnapshot, getDocs, orderBy, doc, deleteDoc } from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from '../services/firebase';


import Nav from "../components/Nav";
import Message from "../components/Message";
import Arrow from "../assets/icons/go-arrow.svg";

import { AuthContext } from "../context/AuthContext";

const Posts = () => {

    const [currentUser, setCurrentUser] = useContext(AuthContext);

    const navigate = useNavigate();

    const { state } = useLocation();

    const [currentArtist, setCurrentArtist] = useState(state);
    const [hasPermission, setHasPermission] = useState(false);
    const userHasPermission = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            if ( doc.data().uid == currentUser.uid ) {
                if ( doc.data().role == "ARTIST" && currentArtist.uid == currentUser.uid ) {
                    setHasPermission(true);
                }
            }
        });        
    }
    useEffect(() =>{
        userHasPermission();
    },[]);

    const [allPosts, setAllPosts] = useState([]);
    const getPosts = async () => {
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where("post_author", "==", currentArtist.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docs.map((doc) => {
                const countComments = async () => {
                    const collectionRef = collection(db, "posts", doc.id, "comments");
                    const commentsSize = await getDocs(collectionRef);
                    setAllPosts((prev) => [...prev, {
                        ...doc.data(),
                        id: doc.id,
                        comment_number: commentsSize.size
                    }]);
                }
                countComments();
            })
        })
        return unsubscribe;
    }
    useEffect(() => {
        getPosts();
    }, []);

    

    const deletePost = async (id) => {
        const docRef = doc(db, "posts", id);
        await deleteDoc(docRef);
    }

    return (
        <>
            <Nav />
            
            <div className="px-6 mx-0 pt-20 pb-10 text-zinc-200">

                {allPosts?.map((post) => {
                    return (
                        <Message                                
                                key={post.id}
                                content={post.content}
                                avatar={post.avatar}
                                username={currentArtist.username ? currentArtist.username : currentArtist.email}
                                media={post.media}
                                time={(() => {
                                    var date = new Date(post.created_at * 1000);
                                    var hours = date.getHours();
                                    var minutes = date.getMinutes();
                                    var formattedTime = hours + ':' + minutes;
                                    return formattedTime;
                                })()}
                            >

                            {hasPermission && 
                                <div className="flex items-center gap-6 mt-2">
                                    <button
                                        className="flex items-center text-red-200"
                                        onClick={() => deletePost(post.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="flex items-center text-blue-200"
                                        onClick={()=>{navigate("/post", {state: post})}}
                                    >
                                        Edit
                                    </button>
                                </div>
                            }

                            <div
                                onClick={() => navigate(`/${currentArtist.id}/${post.id}`, {state: {...post}})}
                                className="flex items-center justify-between w-full border-2 border-violet-600 w-full rounded-full mt-4 pl-4 pr-2 py-2"
                            >
                                <button>{post.comment_number} comments</button>
                                <img src={Arrow} alt="GO ->" className="bg-violet-600 rounded-full" />
                            </div>
                        </Message>
                    )
                })}
            </div>
        </>
    )
}

export default Posts;