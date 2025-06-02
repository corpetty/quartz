---
title: Anonymous chat with crypto-transfer enabled
tags:
  - future
  - project
  - chat
---
A chat app that is enabled by Waku that uses the [moot](https://notes.status.im/moot-account) account. This account was created by [Status](https://status.app) early in its existence to be used as a  universal anonymous account. We in the org used it as a way to give feedback and talk anonymously. 

This account eventually stopped being used, but I haven't forgotten it, or its overall purpose. 

This new chat app would be an extension of that, which enables anonymous chat by using a universal crypto seed phrase to derive the chat key within Waku. The seed phrase is hard coded as an identity.

I was thinking about enabling wallet functionality by using random derivation paths somehow, but it seems that won't work because you'd need to load funds into it somehow, thereby creating a traceable path. So some extra thought would be needed to enable such a thing. 