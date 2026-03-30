'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { refreshAccessToken } from '../redux/slices/auth/authThunks';
import { useAppDispatch } from '../redux/hook';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    // const dispatch = useAppDispatch();
    
    useEffect(() => {
        // Single initialization for the whole app
        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            transports: ["websocket"],
            withCredentials: true,
        });

        
        s.on("connect", () => console.log("✅ Global Socket Connected:", s.id));

        s.on("connect_error", (err) => {
            console.log("❌ Connection Error Reason:", err.message);
            // if (err.message === 'Invalid or expired token') {
            //     dispatch(refreshAccessToken());
            // }
        });

        setSocket(s);

        // Clean up when the entire app closes
        return () => {
            s.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// This is the hook you'll use in your components
export const useSocket = () => {
    return useContext(SocketContext);
};