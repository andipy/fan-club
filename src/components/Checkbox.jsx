import React from "react";

const Checkbox = ({ type, name, handleCheck }) => {
    return (
        <div className="flex flex-row justify-start items-center mb-4">
            <input
                className="mr-3 w-6 h-6"
                type={type}
                name={name}
                onChange={handleCheck}
            />
            <p className="text-zinc-300">I accept the <span className="underline text-zinc-200">terms and conditions</span> of the service</p>
        </div>
    )
}

export default Checkbox;