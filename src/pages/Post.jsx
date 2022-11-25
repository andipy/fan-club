import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { addDoc, updateDoc, doc, collection, serverTimestamp, getDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from '../services/firebase';
import { signOut } from "firebase/auth";

import Nav from "../components/Nav";
import Button from "../components/Button";

const Post = () => {

    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useContext(AuthContext);

    const { state } = useLocation();

    const [post, setPost] = useState({content: ""});
    const [media, setMedia] = useState(null);

    const submitPost = async (e) => {
        e.preventDefault();
        if (post?.hasOwnProperty("id")) {
            const docRef = doc(db, "posts", post.id);
            const updatedPost = {...post, updated_at: serverTimestamp()}
            await updateDoc(docRef, updatedPost);
            return navigate(-1);
        }
        if ( post.content ) {
            let mediaURL;
            const collectionRef = collection(db, "posts");
            const storageRef = ref(storage, `images/${media?.name ? media.name : null}`);
            uploadBytes(storageRef, media).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    mediaURL = url;
                    addDoc(collectionRef, {
                        ...post,
                        created_at: serverTimestamp(),
                        updated_at: null,
                        post_author: currentUser.uid,
                        media: mediaURL ? mediaURL : null
                    });                    
                })
            });
            
            setPost({...post, content: ""});
            setMedia(null);

            return navigate(-1);
        }
    }    
    useEffect(()=>{
        if ( state?.id ) {
            setPost({content: state.content, id: state.id})
        }
    },[])

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

    const [isArtist, setIsArtist] = useState(false);
    const checkIsArtist = async () => {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("uid", "==", currentUser.uid))
        const querySnap = await getDocs(q);
        querySnap.forEach((doc) => {
            setIsArtist(() => {
                if (doc.data().role === "ARTIST") {
                    return true;
                }
            })
        })
        
    }
    useEffect(() => {
        checkIsArtist();
    }, [])

    return (
        <div>
            <Nav />
            <div className="px-6 mx-0 pt-20">
                {isArtist &&
                    <div>
                        <h4 className="text-zinc-200 text-3xl font-semibold mb-2">{post.id ? "Update your post" : "Create new post"}</h4>
                        <form onSubmit={submitPost}>
                            <input
                                onChange={(e) => setPost({...post, content: e.target.value})}
                                value={post.content}
                                type="text"
                                placeholder="Type here"
                                className="bg-zinc-700 w-full py-3 px-4 rounded-md font-regular text-zinc-200 mb-2 mt-2"                        
                            />
                            <input
                                onChange={(e) => setMedia(e.target.files[0])}
                                type="file"
                                accept="image/*, video/*, audio/*"
                                className="bg-zinc-700 w-full py-3 px-4 rounded-md font-regular text-zinc-200 mb-2 mt-2"
                            />
                            <button type="submit" className="w-full py-3 px-6 bg-violet-600 rounded-md text-white">Submit</button>
                        </form>
                    </div>
                }

                <div className="mt-8 mb-8">
                    <div className="text-zinc-200 text-xl font-semibold">You are {currentUser.email}</div>
                    <Button
                        button={buttonLogout}
                        onClickFunction={handleSignOut}
                    />
                </div>
            </div>
        </div>
    )
}

export default Post;