const GestureHooks = {
    useLongPress: (callback = () => {}, ms = 500) => {
        const [startLongPress, setStartLongPress] = React.useState(false);

        React.useEffect(() => {
            let timerId;
            if (startLongPress) {
                timerId = setTimeout(() => {
                    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
                    callback();
                }, ms);
            } else {
                clearTimeout(timerId);
            }

            return () => {
                clearTimeout(timerId);
            };
        }, [startLongPress, callback, ms]);

        return {
            onMouseDown: () => setStartLongPress(true),
            onMouseUp: () => setStartLongPress(false),
            onMouseLeave: () => setStartLongPress(false),
            onTouchStart: () => setStartLongPress(true),
            onTouchEnd: () => setStartLongPress(false),
        };
    },

    useSwipe: ({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50 }) => {
        const [touchStart, setTouchStart] = React.useState(null);
        const [touchEnd, setTouchEnd] = React.useState(null);

        const minSwipeDistance = threshold;

        const onTouchStart = (e) => {
            setTouchEnd(null);
            setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
        };

        const onTouchMove = (e) => {
            setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
        };

        const onTouchEnd = () => {
            if (!touchStart || !touchEnd) return;
            
            const distanceX = touchStart.x - touchEnd.x;
            const distanceY = touchStart.y - touchEnd.y;
            const isLeftSwipe = distanceX > minSwipeDistance;
            const isRightSwipe = distanceX < -minSwipeDistance;
            const isUpSwipe = distanceY > minSwipeDistance;
            const isDownSwipe = distanceY < -minSwipeDistance;

            if (Math.abs(distanceX) > Math.abs(distanceY)) {
                if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
                if (isRightSwipe && onSwipeRight) onSwipeRight();
            } else {
                if (isUpSwipe && onSwipeUp) onSwipeUp();
                if (isDownSwipe && onSwipeDown) onSwipeDown();
            }
        };

        return {
            onTouchStart,
            onTouchMove,
            onTouchEnd
        };
    },

    useShake: (onShake, threshold = 15) => {
        React.useEffect(() => {
            let lastX = 0, lastY = 0, lastZ = 0;
            let lastUpdate = 0;

            const handleMotion = (event) => {
                const current = event.accelerationIncludingGravity;
                if (!current) return;
                
                const curTime = Date.now();
                if ((curTime - lastUpdate) > 100) {
                    const diffTime = curTime - lastUpdate;
                    lastUpdate = curTime;

                    const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;

                    if (speed > threshold * 100) { // Scaled threshold
                        onShake();
                    }

                    lastX = current.x;
                    lastY = current.y;
                    lastZ = current.z;
                }
            };

            window.addEventListener('devicemotion', handleMotion);
            return () => window.removeEventListener('devicemotion', handleMotion);
        }, [onShake, threshold]);
    }
};