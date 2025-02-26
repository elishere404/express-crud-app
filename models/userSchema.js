const mongo = require('mongoose');

const userSchema = new mongo.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePictureBase64: {
        type: String,
        required: false,
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAASwCAQAAABBKHtEAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfoBwgTCCXc6oTWAACAAElEQVR42u3dd2AUZf7H8e8zm0rvTUq2hACxoGCjqCh2ERVRbNix91O8qt6dd5Y7eznrKXaxgx3FAlYQC6FtC0QCSAs9bef5/XHqTyCBZHd2d8r79c/vd2pmZz/P7OxnnpmdEQEAAIClFBEAsI+KQrNARMRsW2eI+HJ0axERo4XO/81uq8bcLCKiNiTqRXJNY52IiFHdawv5AaBgAfCEcJucDvXtjQ7SVgp0K6O1FOjW0koKpbW0kgJpIy2lQNqKT9pY9ILrJSHrpFo2yXrZIptkvVTLRrVBqs0NaqNU6yq91rcmsbZ4PWMDgIIFwMYqChPd6rurDrqDai8dVHvdQdr/7/+X9pJj05Wul7WyRq9Va2StWqN//v/1Gl9lzgrmwgBQsABk1OL2tT2M9qq77iHddQ/VXrpLD+nmsn1JtarUy2StqtTLdKWxzKzMW9ZrhUow+gAoWAAssLCT0Vv1Ub2lSHpLb91DdbHtjFS61euf1FKpkCVSrhfrJeaSklVsHwAoWACaYHH7uoAR0AHVQ3eXgBRbdmWUG9WopTqml6lKHVOxRGzpkhH1hAKAggVARBa3ry/VA1RAAhKQAVJIIkmrUxU6pmI6pubVlxUv5pQiQMEC4KlKVRcwArpUBkhA+klLEkmLWvWjjql5ZpmKJWLFcaWJBKBgAXCZaG89QHYzSvWuUiKtyCPjNshCmavn+b5PzAtVEAdAwQLgWP87+WeU6gGyh3QmD9tYL2E9T5WpecasomXEAVCwANhevEDvbg40dtWlshulygF+kh9UmVmm5hg/+KuJA6BgAbCRWblt+6pBxiA9SAZLPnk4Ur0s0rPVbJld+E2PzcQBULAAZElZq4KBeoBRqgfJ3pJHHq6RkIV6tpotZTmz+6wlDoCCBSATtSqvxV7mfjJY76VKxCAPd1ctvUjNltnGF5u/Ka0lDoCCBcBy5d3NwXqQDJWh3KvKg+rlOzXTnO37xF9OGAAFC0CKpuf0LFFDZZgaJANIAyKyTGbLDJlpfl1cQxgABQtAs0S6yFAZovaXQVJAGmjAF'
    },
    profilePictureMimeType: {
        type: String,
        required: false,
        default: 'image/png'
    }
});

const User = mongo.model("User", userSchema);

module.exports = User;