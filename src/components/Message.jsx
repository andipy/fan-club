import React from "react";

const Message = ({ children, content, avatar, username, time, email, media, onClick }) => {
    return (
        <div className="p-4 rounded-md bg-zinc-800 text-white mt-2" onClick={onClick}>
            <div className="flex items-center gap-2">
                <div>
                    {avatar &&
                        <img src={avatar} />
                    }
                    {!avatar &&
                        <div className="bg-red-200 w-8 h-8 rounded-full"></div>                
                    }
                </div>
                <h2>{username ? username : email}</h2>
            </div>
            <div>
                <p className="my-2">{content}</p>
                {media &&
                    <img src={media} alt="L'artista ha caricato un file, curioso/a?" className="rounded-md mb-2" />
                }
                
            </div>
            <div className="flex justify-end">
                <p className="px-2 rounded-full bg-zinc-700 text-zinc-300">{time}</p>
            </div>
            { children }
        </div>
    )
}

export default Message;