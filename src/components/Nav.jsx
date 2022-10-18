import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import components
import NavIcon from './NavIcon';

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
                <NavIcon src={BackArrow} alt={'< BACK'} />
            </div>
            <div className="flex items-center gap-2">
                <NavIcon src={NotificationsEnabled} alt={'SMS'} />
                <NavIcon src={UserProfile} alt={'PROFILE'} />
            </div>
        </nav>
    )
}

export default Nav;