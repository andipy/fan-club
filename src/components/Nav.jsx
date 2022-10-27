import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import graphic assets
import BackArrow from '../assets/icons/backArrow.svg';
import UserProfile from '../assets/icons/userProfile.svg';
import NotificationsEnabled from '../assets/icons/notificationsEnabled.svg';

const Nav = () => {

    const navigate = useNavigate();
    const params = useParams();
    const [navTransparent, setNavTransparent] = useState(false);

    const navStyle = () => {
        if ( params.id ) {
            setNavTransparent(true);
        }
    }

    useEffect(() => {
        navStyle();
    },[]);    

    return (
        <nav className={`px-6 mx-0 py-4 flex items-center justify-between fixed w-full z-10 ${navTransparent ? "" : "bg-zinc-900"}`}>
            <div onClick={() => navigate(-1)}>
                <img src={BackArrow} alt="< BACK" className="py-2 px-2 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
                <img src={NotificationsEnabled} alt="SMS" className="py-2 px-2 rounded-full" />
                <img
                    src={UserProfile}
                    alt="PROFILE"
                    className="py-2 px-2 rounded-full"
                    onClick={()=> navigate("/post")}
                />
            </div>
        </nav>
    )
}

export default Nav;