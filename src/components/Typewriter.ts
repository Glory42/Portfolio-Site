export function typeWriter(
    element: HTMLElement,
    text: string,
    speed: number = 100,
    callback?: () => void
) {
    let i = 0;
    function typing() {
        if(i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else if(callback) {
            callback();
        }
    }
    typing();
}