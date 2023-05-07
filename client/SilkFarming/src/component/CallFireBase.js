import { getMessaging, getToken } from "firebase/messaging";

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
getToken(messaging, { vapidKey: 'BB_EZROd2-YmAKRxGnn9AtWrPfnKnLmz3G7zgBx1K7rofboPK0ptqi3ad82jdiCeB0Rjq1f7nRjWe0RwOS_J3RQ' }).then((currentToken) => {
    if (currentToken) {
        console.log(currentToken)
        fetch('https://firebase.google.com/docs/cloud-messaging/js/client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,

            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "Success") {
                    navigation.navigate('Home', { user: data.user });
                }
                console.log(data);
            })
            .catch(error => {
                ToastAndroid.show('Wrong Password', ToastAndroid.SHORT, ToastAndroid.RED);
                console.error(error);
            });

    } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
});






