---
title: Freenet Notes
tags:
  - freenet
  - distributed-systems
---

# General Overview
notes on [this video](https://www.youtube.com/watch?v=enTAromEeHo&t=9s)

## General takeaways
- Seems to fundamentally be a peer connection process to maintain a healthy mesh of responding to requests
	- "more of a communication medium than a storage medium"
- should look into understanding the differentiation between IFPS data and Freenet contracts
	- it's fundamentally just IPFS but computation instead of static data
- heavy reliance upon webassembly for computation
- it doesn't seem to handle the adversarial environment

## Raw Notes
- seems to be a VERY high level description, not going into actual mechanism
- gives description of the internet today
![](Pasted%20image%2020241122114712.png)

- Vision of freenet
![](Pasted%20image%2020241122114740.png)
- freenet core is about 5-6 MB
- fundamentally a distributed key-value store
	- key is blake3 hash of webassembly code
	- role of that code (contract)
		- validates some "state"
		- how to apply change to state
		- sync the state
	- contracts can read other contracts
	- contracts "are just data stored on the network by peers"
- allows for same API as how the web browser talks to the current internet
- how to find a given key?
	- num peers is 20-30
		- peer address is first 4 bytes of hash of IP
	- routed through network by working towards a given target between 0-1
	- greedy routing - going through the closest peer you're connected to
	- fastest figures out fastest route, chooses it (goes over _Isotonic Regression_)
		- gives a implementation at https://github.com/sanity/pav.rs
	- goes over relationship between latency vs failure rate vs transfer speed
	- freenet performs regressions on its experience with the above properties to predict performance, and adjust peer connections accordingly
- bootstrapping to the network
	- initial connect request with ansatz target location, traverse, accept on optimal peer once found
	- use trick to get around firewalls (hole-punching)
	- decide optimality of peer connection via (small world network)
		- optimal: probability of connection between two peers is 1/distance
		- trying to balance connections with incoming request distribution. Does this 
- resource management
	- types
		- bandwidth
		- memory
		- storage
	- consumers of resources
		- contracts
		- connected peers
	- contract's "value" proportional to inbound requests
	- peer's "value" is proportional to number of requests it responds to (outbound requests)
	- garbage collection of contracts with lowest value relative to cost (peer's view)
		- similar to how IPFS serves data - performance dictated by demand
- future: data streaming
	- send response along the request chain instead of directly
		- no additional connection requirements, reuses established network topology
	- currently this must be done by sending the entire data
- questions
	- compare contrast around other similar protocols
		- freenet's unique thing is data is identified by hash of contract
		- freenet wants to be general purpose platform for distributed computation
	- how do you get any confidence that "it works"
		- it's difficult because an individual peer isn't consistent (in general)
		- simulations were used to ensure topology self-organized in the way that it should (happy path)
		- then used simulated network stack to experiment and validate behavior there
		- 3rd is using something like shadow to simulate peers on a singular machine
		- then release and ensure it works as it should (very close to this as of Jun 2024)
	- contracts have state transitions, what mechanism causes eventual consistency. What pushes state transitions back towards the network?
		- when you modify the state of a contract, you start locally (mentions concept of subscription to a contract)
		- modification will be noticed by subscribers to contracts -> sync protocol updates state with others
		- not a clear answer
		- contracts can (required???) define how state is updated, spread of that state transition is viral throughout the network (flooding???)
		- lots of assumptions of optimistic execution

# Ghost Keys Video
- notes on [this video](https://freenet.org/news/ghost-keys-ian-interview/)
- 