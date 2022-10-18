import React from "react";

const Input = ({ placeholder, type, label, name, onChange }) => {
    return (
        <div className="mb-4">
            <label className="text-zinc-300">{label}</label>
            <input
                className="bg-zinc-700 w-full py-3 px-4 rounded-md font-regular text-white"
                placeholder={placeholder}
                type={type}
                name={name}
                onChange={onChange}
            />
        </div>
    )
}

export default Input;