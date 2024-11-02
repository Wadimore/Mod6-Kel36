import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import Card from "../components/card";
import Modal from "../components/modal";

export default function LandingPage() {
    const [data, setData] = useState(null);
    const [isLoaded, setisLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("One Piece");
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    
    // Modal
    const [modalShow, setModalShow] = useState(false);
    const [modalItem, setModalItem] = useState(null);
    
    useEffect(() => {
        // Listen for online/offline changes
        const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOnlineStatus);

        const fetchData = async (query) => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    "https://imdb8.p.rapidapi.com/auto-complete", {
                        params: { q: query },
                        headers: {
                            "x-rapidapi-host": "imdb8.p.rapidapi.com",
                            "x-rapidapi-key": "b7a5a35414msha311f9c6e9d5733p16a797jsn6bab97040a6f",
                        },
                    }
                );
                if (response.status === 200) {
                    setData(response.data);
                    setisLoaded(true);
                    setIsLoading(false);
                    // Save search result and query in localStorage for offline use
                    localStorage.setItem('lastSearchData', JSON.stringify(response.data));
                    localStorage.setItem('lastSearchQuery', query);
                }
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        };

        if (!isLoaded) {
            // Check for offline data in localStorage
            const offlineData = localStorage.getItem('lastSearchData');
            const lastQuery = localStorage.getItem('lastSearchQuery');
            if (isOffline && offlineData) {
                setData(JSON.parse(offlineData));
                setQuery(lastQuery || ""); // Set last query if available
                setisLoaded(true);
            } else {
                fetchData(query);
            }
        }

        return () => {
            window.removeEventListener("online", handleOnlineStatus);
            window.removeEventListener("offline", handleOnlineStatus);
        };
    }, [isLoaded, query, isOffline]);

    const onSearch = (e) => {
        if (e.key === "Enter") {
            if (isOffline) {
                alert("You are offline. Unable to fetch new data.");
            } else {
                setisLoaded(false);
                setQuery(e.target.value);
            }
        }
    };

    const handleClick = (item) => {
        setModalShow(!modalShow);
        setModalItem(item);
    };

    return (
        <main>
            <input
                type="text"
                placeholder="Search film by name"
                onKeyDown={(e) => onSearch(e)}
            />
            <h3 className="title">Search : {query}</h3>
            {!data || isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="card-container">
                    {isOffline && !data ? (
                        <p>You are offline. Please check your internet connection.</p>
                    ) : (
                        data.d.map((item, index) => {
                            return (
                                <Card data={item} key={index} onClick={() => handleClick(item)} />
                            );
                        })
                    )}
                </div>
            )}
            <Modal
                data={modalItem}
                isShow={modalShow}
                onCancel={() => setModalShow(false)}
            />
        </main>
    );
}
