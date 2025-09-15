import { onMounted, onBeforeUnmount } from 'vue';
import { socket } from '../plugins/socket';
import router from "@/Router";
import { routeLink } from '../utils/route-link';

export function useOnlineStatus(userId) {
    let intervalId = null;

    const sendOnlineStatus = () => {
        socket.emit('user_online', userId);
    };

    onMounted(() => {
        // Send immediately when tab opens
        sendOnlineStatus();

        // Also handle tab visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') sendOnlineStatus();
        });

        // Handle tab close
        window.addEventListener('beforeunload', () => {
            socket.emit('user_offline', userId);
        });

        socket.on('user_logout', () => {
            router.push(routeLink.login);
            localStorage.removeItem('token')
        })
    });

    onBeforeUnmount(() => {
        clearInterval(intervalId);
        socket.emit('user_offline', userId);
    });
}
