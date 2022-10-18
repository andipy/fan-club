import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { addDoc, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

import Nav from "../components/Nav";
import { useEffect } from "react";

const Post = () => {

    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useContext(AuthContext);

    const { state } = useLocation();

    const [post, setPost] = useState({content: ""});
    const handleInput = (e) => {
        setPost({...post, content: e.target.value});
    }
    const submitPost = async (e) => {
        e.preventDefault();

        if (post?.hasOwnProperty("id")) {
            const docRef = doc(db, "posts", post.id);
            const updatedPost = {...post, updated_at: serverTimestamp()}
            await updateDoc(docRef, updatedPost);
            return navigate(-1);
        } else if ( post.content ) {
            const collectionRef = collection(db, "posts");
            await addDoc(collectionRef, {
                ...post,
                created_at: serverTimestamp(),
                updated_at: null,
                post_author: currentUser.uid
            });
            setPost({...post, content: ""});
            return navigate(-1);
        }
    }
    
    useEffect(()=>{
        if ( state?.id ) {
            setPost({content: state.content, id: state.id})
        }
    },[])

    return (
        <div>
            <Nav />
            <div className="px-6 mx-0 pt-20">
                <h4 className="text-zinc-200 text-3xl font-semibold mb-2">{post.id ? "Update your post" : "Create new post"}</h4>
                <form onSubmit={submitPost}>
                    <input
                        onChange={handleInput}
                        value={post.content}
                        type="text"
                        placeholder="Type here"
                        className="bg-zinc-700 w-full py-3 px-4 rounded-md font-regular text-zinc-200 mb-2 mt-2"                        
                    />
                    <button type="submit" className="w-full py-3 px-6 bg-violet-600 rounded-md text-white">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Post;