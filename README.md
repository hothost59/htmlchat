# htmlchat

## Usage
First, go to https://console.firebase.google.com/, and login. Then, create a new project. You can name it whatever. You can enable analytics; it doesn't matter. Go into settings, enable web access. Then, enable Realtime Database, test mode. Go to settings, scroll to config, and copy the config and go to the code and replace the firebaseConfig const. It is also hosted on https://hothost59.github.io/htmlchat.

## Firebase Initialization
Make sure that your project is started in test mode, then use the following security rules:
```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$username": {
        ".write": "auth != null && auth.token.email.replace('@chat.com', '') === $username",
        "notifications": {
          ".write": "auth != null"
        }
      }
    },
    "presence": {
      ".read": "auth != null",
      "$username": {
        ".write": "auth != null && auth.token.email.replace('@chat.com', '') === $username"
      }
    },
    "channels": {
      ".read": "auth != null",
      "$channelId": {
        ".write": "auth != null",
        ".validate": "!$channelId.beginsWith('dm__') || $channelId.contains(auth.token.email.replace('@chat.com', ''))"
      }
    },
    "messages": {
      "$channelId": {
        ".read": "auth != null && (!$channelId.beginsWith('dm__') || $channelId.contains(auth.token.email.replace('@chat.com', '')))",
        "$messageId": {
          ".write": "auth != null && ((!data.exists() && newData.child('user').val() === auth.token.email.replace('@chat.com', '')) || (data.exists() && data.child('user').val() === auth.token.email.replace('@chat.com', '')))",
          ".validate": "newData.hasChildren(['user', 'text', 'ts'])"
        }
      }
    }
  }
}
```
