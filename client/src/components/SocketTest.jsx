// src/components/SocketTest.js

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const SocketTest = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [banner, setBanner] = useState(null); // State for banner announcement
    const navigate = useNavigate();  // Use navigate hook for page navigation

    useEffect(() => {
        // Connect to the server
        const socket = io("http://localhost:5000");

        // Listen for the 'connect' event
        socket.on("connect", () => {
            console.log("Connected to the server");
            setIsConnected(true);
        });

        // Listen for the 'disconnect' event
        socket.on("disconnect", () => {
            console.log("Disconnected from the server");
            setIsConnected(false);
        });

        // Listen for new announcements
        socket.on("update-announcement", (announcement) => {
            console.log("New announcement received:", announcement);

            // Update the state with the new announcement
            setAnnouncements((prevAnnouncements) => [
                ...prevAnnouncements,
                announcement,
            ]);

            // Show the new announcement in the banner
            setBanner(announcement);

            // Display the announcement as a toast notification
            toast.info(`📢 ${announcement.title}: ${announcement.content}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });

        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    // Handle banner close
    const closeBanner = () => {
        setBanner(null); // Hide the banner
    };

    // Handle "Read More" button click to navigate to the announcement page
    const handleReadMore = () => {
        navigate("/announcement"); // Navigate to the Announcement page
    };

    return (
        <div style={{ paddingTop: banner ? "40px" : "0" }}> {/* Adjust padding for banner */} 
            <ToastContainer /> {/* Required for Toastify */}

            {/* Display Announcement Banner */}
            {banner && (
                <div
                    style={{
                        backgroundColor: " #e600e6",
                        color: "#fff",
                        padding: "15px 20px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        textAlign: "center",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000, // Ensure it's above other elements
                        fontFamily: "crossorigin  "
                    }}
                >
                    <span>{banner.title}: {banner.content}</span>

                    {/* "Read More" Button */}
                    <button
                        onClick={handleReadMore}
                        style={{
                            marginLeft: "20px",
                            backgroundColor: "#ff4444",
                            color: "#fff",
                            border: "none",
                            padding: "5px 15px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Read More
                    </button>

                    {/* Close (X) Icon */}
                    <span
                        onClick={closeBanner}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            fontSize: "20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        &times;
                    </span>
                </div>
            )}

        </div>
    );
};

export default SocketTest;
