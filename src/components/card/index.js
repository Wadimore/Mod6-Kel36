import React from "react";
import "./index.css";

export default function Card({ data, onClick }) {
    const placeholderImage = process.env.PUBLIC_URL + "/placeholder.png"; // Path gambar di public

    return (
        <div className="card" onClick={onClick}>
            <img
                src={data?.i?.imageUrl || placeholderImage}
                alt={data.l || "Movie Image"}
            />
            <h4>{data.l}</h4>
            <p>{data.q || "No information available"}</p> {/* Menampilkan tipe film */}
        </div>
    );
}
