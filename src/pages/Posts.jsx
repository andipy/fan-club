import { collection, query, where, onSnapshot, getDocs, orderBy, doc, deleteDoc } from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from '../services/firebase';
import { signOut } from "firebase/auth";

import Nav from "../components/Nav";
import Button from "../components/Button";
import Message from "../components/Message";
import Arrow from "../assets/icons/go-arrow.svg";

import { AuthContext } from "../context/AuthContext";

const Posts = () => {

    const [currentUser, setCurrentUser] = useContext(AuthContext);

    const navigate = useNavigate();

    const { state } = useLocation();

    const [currentArtist, setCurrentArtist] = useState(state);

    const [allPosts, setAllPosts] = useState([]);
    const getPosts = async () => {
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where("post_author", "==", currentArtist.id))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setAllPosts(querySnapshot.docs.map((doc) => {
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
    useEffect(() => {
        getPosts();
    }, [currentArtist]);

    const [isArtist, setIsArtist] = useState(false);
    const userIsArtist = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if ( doc.data().id == currentUser.uid ) {
                if ( doc.data().role == "ARTIST" ) {
                    setIsArtist(true);
                }
            }
        });        
    }
    useEffect(() =>{
        userIsArtist();
    },[]);

    const deletePost = async (id) => {
        const docRef = doc(db, "posts", id);
        await deleteDoc(docRef);
    }

    const handleSignOut = (e) => {
        e.preventDefault();  
        signOut(auth)
        .then(() => {
            // Sign-out successful.
            setCurrentUser(null);
            navigate('/login');
        }).catch((error) => {
            // An error happened.
            console.log('An error happened');
        });
    };

    // object with the data about the logout button
    const buttonLogout = {
        label: 'Logout',
        style: 'w-full border-solid border-2 border-violet-600 text-violet-400 mt-3 py-3 rounded-lg font-semibold',
        disabled: false
    }

    return (
        <>
            <Nav />
            
            <div className="px-6 mx-0 pt-20 text-zinc-200">

                {isArtist && 
                    <div className="mb-8">
                        <button
                            onClick={()=>navigate('/post')}
                            className="w-full py-3 px-6 bg-violet-600 rounded-md text-white"
                        >
                            + Create new post
                        </button>
                    </div>
                }

                {allPosts?.map((post) => {
                    return (
                        <Message                                
                                key={post.id}
                                content={post.content}
                                avatar={post.avatar}
                                username={currentArtist.username ? currentArtist.username : currentArtist.email} 
                                time={(() => {
                                    var date = new Date(post.created_at * 1000);
                                    var hours = date.getHours();
                                    var minutes = date.getMinutes();
                                    var formattedTime = hours + ':' + minutes;
                                    return formattedTime;
                                })()}
                            >

                            {isArtist && 
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
                                <button>
                                    {post.comments?.length ? post.comments?.length : '0'} comments
                                </button>
                                <img src={Arrow} alt="GO ->" className="bg-violet-600 rounded-full" />
                            </div>
                        </Message>
                    )
                })}

                <div className="mt-8 mb-8">
                    <div className="text-zinc-200 text-xl font-semibold">You are {currentUser.email}</div>
                    <Button
                        button={buttonLogout}
                        onClickFunction={handleSignOut}
                    />
                </div>
            </div>
        </>
    )
}

export default Posts;