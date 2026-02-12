const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

async function sendNotificationToAdmins(title, body, url) {
    const tokensSnapshot = await admin.firestore().collection("admin_fcm_tokens").get();
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
        console.log("No admin tokens found.");
        return;
    }

    // Prepare message for Multicast (sending to multiple tokens)
    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: {
            url: url
        },
        tokens: tokens,
        webpush: {
            fcmOptions: {
                link: url
            },
            notification: {
                icon: '/shopify.png',
                requireInteraction: true
            }
        }
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(response.successCount + ' messages were sent successfully');
        
        // Cleanup invalid tokens
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    const error = resp.error;
                    if (error.code === 'messaging/invalid-registration-token' ||
                        error.code === 'messaging/registration-token-not-registered') {
                        failedTokens.push(tokensSnapshot.docs[idx].ref.delete());
                    }
                }
            });
            await Promise.all(failedTokens);
            console.log('Removed ' + failedTokens.length + ' invalid tokens');
        }
    } catch (error) {
        console.log('Error sending message:', error);
    }
}

exports.onInquiryCreated = functions.firestore
    .document("inquiries/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        await sendNotificationToAdmins(
            "New Project Inquiry!",
            `From: ${data.name} (${data.serviceType})`,
            "https://www.wbify.com/admin/inquiries"
        );
    });

exports.onContactCreated = functions.firestore
    .document("contact_messages/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        await sendNotificationToAdmins(
            "New Contact Message!",
            `From: ${data.firstName} ${data.lastName}`,
            "https://www.wbify.com/admin/dashboard"
        );
    });
