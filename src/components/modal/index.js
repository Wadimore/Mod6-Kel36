// Modal.js
import React from "react";
import "./index.css";

export default function Modal({ data, isShow, onCancel }) {
    if (!isShow || !data) return null;

    const placeholderImage = process.env.PUBLIC_URL + "/placeholder.png"; // Path gambar di public

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <img
                    src={data?.i?.imageUrl || placeholderImage}
                    alt={data.l || "Movie Image"}
                    className="modal-image"
                />
                <div className="modal-info">
                    <h2>Data Information</h2>
                    <p><strong>Judul:</strong> {data.l}</p>
                    <p><strong>Platform:</strong> {data.q || "Unknown"}</p>
                    <p><strong>Tahun Rilis:</strong> {data.y || "Unknown"}</p>
                    <p><strong>Pemeran:</strong> {data.s || "Unknown"}</p>
                </div>
                <button className="modal-close-btn" onClick={onCancel}>Close</button>
            </div>
        </div>
    );
}
