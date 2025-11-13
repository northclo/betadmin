import { onMounted, onBeforeUnmount } from 'vue';
import { socket } from '../plugins/socket';
import router from "@/Router";
import { routeLink } from '../utils/route-link';

export function useOnlineStatus(userId) {
    let intervalId = null;

    const sendOnlineStatus = () => {
        if (socket.connected && userId) {
            socket.emit('user_online', userId);
        } else if (userId) {
            socket.once('connect', () => {
                socket.emit('user_online', userId);
            });
        }
    };

    onMounted(() => {
        if (!userId) {
            console.warn('useOnlineStatus: No user token provided');
            return;
        }

        if (socket.connected) {
            sendOnlineStatus();
        } else {
            socket.once('connect', () => {
                sendOnlineStatus();
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') sendOnlineStatus();
        });

        window.addEventListener('beforeunload', () => {
            if (socket.connected && userId) {
                socket.emit('user_offline', userId);
            }
        });

        socket.on('user_logout', () => {
            router.push(routeLink.login);
            localStorage.removeItem('token')
        });
    });

    onBeforeUnmount(() => {
        clearInterval(intervalId);
        if (socket.connected && userId) {
            socket.emit('user_offline', userId);
        }
    });
}
