const functions = require('firebase-functions');
const admin = require('firebase-admin');
let key = null;

try {
  key = require('./key.json');
} catch(err) {
  console.error('Error: key.json is required');
  process.exit();
}

admin.initializeApp({
  credential: admin.credential.cert(key),
  databaseURL: 'https://online-academy-afe54.firebaseio.com',
  authDomain: 'online-academy-afe54.firebaseapp.com',
});

exports.onCourseEnroll = functions.database.ref('/courses/{id}/students/')
  .onWrite((change, context) => {
    let previous = change.before.val();
    let current = change.after.val();

    if (!previous) {
      previous = [];
    }

    if (!current) {
      current = [];
    }

    const courseId = context.params.id;
    const filtered = current.filter((val) => !previous.includes(val));

    if (filtered.length && courseId) {
      return admin.database().ref(`/courses/${courseId}/`)
        .once('value', data => {
          const id = data.val().authorId;

          const notitcation = {
            type: 'USER_ENROLLED', 
            message: 'The following users are interested in your course',
            payload: [...filtered],
            date: new Date().toString(),
            isRead: false,
          }
        
          return admin.database().ref(`/users/${id}/notifications/`)
            .push(notitcation).then((res) => res).catch((err) => console.log(err));
        })
    } else {
      return null;
    }
})

exports.onCourseAdded = functions.database.ref('/courses/{id}/')
  .onCreate((snap, context) => {
    const id = snap.val().authorId;
    const courseId = context.params.id;

    return admin.database().ref('/followers/')
      .orderByChild('userId')
      .equalTo(id)
      .once('value', data => {
        const followers = [];
        data.forEach(entry => {
          const followerId = entry.val().followerId;
          followers.push(followerId);
        });

        const notification = { 
          type: 'COURSE_ADDED',
          message: 'The user you follow added a new course',
          payload: [courseId],
          date: new Date().toString(),
          isRead: false,
        }

        const updates = {};

        for (const key of followers) {
          const newEntry = admin.database().ref(`users/${key}/notifications/`).push().key;
          updates[`/users/${key}/notifications/${newEntry}`] = notification;
        }

        return admin.database().ref().update(updates);
      })
      .then(res => res)
      .catch(err => console.log(err));
});


exports.onFollow = functions.database.ref(`/followers/{id}`)
  .onCreate((snap, context) => {
    const followerId = snap.val().followerId;
    const userId = snap.val().userId;

    const notification = {
      type: 'FOLLOWER_ADDED',
      message: 'One of the users started following you',
      payload: [followerId],
      date: new Date().toString(),
      isRead: false,
    }
    return admin.database().ref(`/users/${userId}/notifications/`)
      .push(notification)
      .then(res => res)
      .catch(err => console.log(err));
});


exports.onUserDeleted = functions.auth.user().onDelete((user) => {
  const id = user.uid;
  const updates = {};

  admin.database().ref('log/').push({id: user.uid});

  async function deleteRelatedData(id) {

    const ref1 = admin.database().ref(`/followers/`)
      .orderByChild('userId')
      .equalTo(id)
      .once('value', data => {
        if (data) {
          data.forEach(entry => {
            updates[`/followers/${entry.key}/`] = null;
          });
        }
    })

    const ref2 = await admin.database().ref(`/followers/`)
      .orderByChild('followerId')
      .equalTo(id)
      .once('value', data => {
        if (data) {
          data.forEach(entry => {
            updates[`/followers/${entry.key}/`] = null;
        });
      }
   })

    await ref1;
    await ref2;

    updates[`/users/${id}/`] = null;
  }

  return deleteRelatedData(id)
    .then(() => admin.database().ref().update(updates))
    .catch((err) => console.log(err));
});
