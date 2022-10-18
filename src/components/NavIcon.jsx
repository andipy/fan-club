import PreviousMap from "postcss/lib/previous-map";
import React from "react";

const NavIcon = (props) => {
    return (
        <div>
            <img src={props.src} alt={props.alt} className="py-2 px-2 rounded-full"/>
        </div>        
    )
}

export default NavIcon;