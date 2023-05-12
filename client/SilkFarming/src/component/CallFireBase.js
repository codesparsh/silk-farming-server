useEffect(() => {
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
                        handleLogin
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




    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
}, [])
