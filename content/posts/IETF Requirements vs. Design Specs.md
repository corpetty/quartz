---
tags:
  - specification-driven-development
  - ietf
  - requirements
---

> [!NOTE]- This was built with Gemini Pro 2.5 - Research with the following prompt:
> Let's look at rfc under the ietf. Then stuff further into the relationship between requirements and design specs. It is my understanding that specs are implementation independent. How are these boundaries drawn and what is the graph of dependencies?

# **The Architecture of Consensus: Deconstructing Requirements, Specifications, and Dependencies in the IETF Standards Process**

## **Introduction**

The Internet, a system of unprecedented scale and complexity, functions not through centralized command, but through voluntary adherence to a set of shared technical agreements. The enduring success of this global network is the direct result of a unique, pragmatic, and implementation-driven philosophy embodied by the Internet Engineering Task Force (IETF). This report deconstructs the IETF's methodology, focusing on the intricate relationship between requirements and design specifications, the principle of implementation independence, and the multi-layered graph of dependencies that underpins the Internet's architecture.  

The central thesis of this analysis is that the IETF model deliberately blurs the traditional corporate distinction between a "requirements document" and a "design specification." Instead, it forges a symbiotic relationship where normative requirements are embedded directly within detailed behavioral specifications. This integration is made unambiguous and enforceable through a specialized lexicon defined in formal process documents. The principle of "implementation independence"—the idea that a specification should define externally observable behavior without dictating internal design—is the cornerstone of this model. It is not an abstract ideal but a practical mandate, rigorously enforced by the IETF's core mantra: "rough consensus and running code."  

This report will navigate the IETF's ecosystem, beginning with its foundational philosophy and the structure of its primary artifact, the Request for Comments (RFC). It will then dissect the anatomy of an Internet Standard, revealing the evolutionary process that forges consensus into code. The analysis will then pivot to the core of the inquiry: the precise mechanisms used to define requirements within specifications and the methods that guarantee implementation independence. These concepts will be synthesized into a comprehensive, multi-layered "graph of dependencies," illustrating the interlocking relationships between documents, procedures, and protocols. Finally, a detailed case study tracing the evolution from the Transmission Control Protocol (TCP) to the modern QUIC protocol will provide a concrete demonstration of these principles in action. This examination is critical for any architect or engineer seeking to understand not just how the Internet's foundational protocols work, but *why* they work with such remarkable stability and resilience.

## **I. The IETF and the RFC Ecosystem: From Unofficial Notes to Internet Law**

To comprehend the relationship between requirements and specifications within the IETF, one must first understand the organization's unique culture and the documentary framework it has cultivated for over half a century. The IETF is not a typical standards body, and its primary output, the Request for Comments (RFC), is a document with a storied history that informs its modern function.

### **1.1 The IETF Mission and Philosophy**

The mission of the IETF, as stated in RFC 3935, is "to make the Internet work better" by producing "high quality, relevant technical and engineering documents". This seemingly simple goal is underpinned by a distinct and explicitly non-neutral value system. The IETF actively embraces technical concepts such as "decentralized control, edge-user empowerment and sharing of resources" because these values resonate with its community. This philosophical leaning has profound architectural consequences, favoring protocols that place intelligence and control at the edges of the network—in the end-user's device—rather than in a centralized core. This aligns with the famed "end-to-end argument" in system design, which posits that many functions can only be correctly and completely implemented with the knowledge of the applications at the endpoints.  

Structurally, the IETF is defined by what it lacks: there is no formal membership. Anyone may participate by joining a mailing list or attending a meeting. All participants are considered volunteers who contribute as individuals, even if they are sponsored by a corporation or academic institution. This model is a cornerstone of the IETF's consensus-based approach. It prevents any single entity from dominating the standards process through sheer force of representation, compelling proposals to be judged on their technical merit and their ability to persuade a diverse community of peers.

### **1.2 The Evolution and Anatomy of a Request for Comments (RFC)**

The RFC series began in 1969, invented by Steve Crocker as a mechanism to "record unofficial notes on the development of ARPANET". The name "Request for Comments" is a historical artifact that perfectly captures the collaborative, non-authoritarian spirit of its origins. While RFCs have since become the official publication series for "Internet specifications, communications protocols, procedures, and events," this legacy of open commentary and peer review remains central to the process.  

A defining characteristic of an RFC is its immutability. Once an RFC is assigned a number and published, its text is never modified. If amendments are required, a new document is authored and published with a new serial number. This new RFC will formally state that it "updates" or "obsoletes" the previous one. This mechanism creates a continuous, traceable historical record of the Internet's technical evolution. For implementers, this immutability provides a stable, fixed target; one can build a system against a specific RFC with the assurance that its content will not change. The "updates" and "obsoletes" linkages are the foundational elements of a document-level dependency graph, allowing for the clear and unambiguous evolution of standards over time. The publication formats have also evolved, from the original fixed-width ASCII text to modern, accessible formats like HTML, PDF, and the normative source format, RFCXML, ensuring the documents remain usable in a changing technological landscape.

### **1.3 A Taxonomy of RFCs: Streams and Statuses**

A common misconception is that every RFC is an Internet Standard. The reality is far more nuanced. The IETF employs a sophisticated taxonomy of "streams" and "statuses" to classify each publication, defining its origin, purpose, and level of community consensus.  

There are five publication streams: IETF, Internet Research Task Force (IRTF), Internet Architecture Board (IAB), Independent Submission, and Editorial. Each represents a different source and review process. The IRTF stream, for example, publishes research results, while the IAB stream publishes architectural and policy guidance.  

Crucially, only the IETF stream is empowered to publish documents that can become formal Internet Standards. Within this stream (and others), documents are assigned a status that indicates their maturity and purpose. These statuses include:

* **Standards Track:** Documents intended to become Internet Standards, progressing through maturity levels (discussed in Section II).  
* **Best Current Practice (BCP):** Documents that codify the IETF's own processes or provide strong operational recommendations to the community.  
* **Informational:** Documents published for the general information of the community, which do not represent an IETF consensus or recommendation. This can include specifications from other bodies or useful technical discussions.  
* **Experimental:** Specifications that are part of a research or development effort, published to the community for trial and feedback. They are not standards and may be changed or abandoned.  
* **Historic:** A status assigned to any document that has been superseded or is otherwise considered obsolete.

Understanding this taxonomy is essential. An RFC's stream and status are the primary metadata that define its authority. An "Informational" RFC from the Independent Submission stream carries a very different weight than a "Standards Track" RFC from the IETF stream that has achieved community consensus.  

The structure of the IETF is not an accident of history but a deliberately engineered system to manage the creation of high-quality standards in a large, distributed, and diverse community. At first glance, the open, volunteer-driven model might seem like a recipe for chaos. However, the process is highly structured. Ideas originate as individual "Internet-Drafts" (I-Ds), which have no formal status and expire after six months if not acted upon. These drafts are debated within focused Working Groups (WGs), each dedicated to a specific technical area. To advance, a draft must achieve "rough consensus" within the WG—a determination by the WG chair that all significant technical objections have been heard and addressed. Finally, the draft is reviewed and approved by the Internet Engineering Steering Group (IESG), the IETF's technical leadership body, before being published by the RFC Editor. This multi-stage process creates a "funnel of consensus," allowing a wide variety of ideas to be proposed at the top while ensuring that only the most technically sound, well-vetted, and broadly supported proposals emerge as published RFCs.  

Furthermore, the RFC publication model itself can be understood as a form of "semantic versioning" for standards. In software engineering, version numbers like Major.Minor.Patch signal the nature of a change. The RFC system achieves a similar, but more robust, outcome. An RFC that "updates" another is akin to a minor revision or a patch; it clarifies behavior or adds functionality in a backward-compatible way. An RFC that "obsoletes" another represents a major version change, a fundamental replacement of the protocol. The definitive example is the original TCP specification, RFC 793, which was finally obsoleted after 41 years by RFC 9293 in 2022\. The immutability of individual RFCs, combined with these explicit, machine-readable dependency links, provides a clear and unambiguous dependency graph that is far more durable than simple numerical versioning.

## **II. The Anatomy of an Internet Standard: Forging Consensus into Code**

While the RFC series encompasses a wide variety of documents, the process for creating a formal Internet Standard is particularly rigorous. This process, known as the "Standards Track," is a gauntlet designed to ensure that protocols are technically excellent, thoroughly tested, and enjoy widespread community consensus before being enshrined as a standard.

### **2.1 The Standards Track: A Gauntlet of Maturity**

The modern IETF Standards Track, as defined by RFC 2026 and updated by RFC 6410, consists of two primary maturity levels :

1. **Proposed Standard (PS):** This is the entry point to the standards track. A specification at this level is considered stable, has resolved known design choices, and has received significant community review. Implementations are encouraged, but not strictly required at this stage, though some implementation experience is highly desirable. Many widely used and important protocols remain at the Proposed Standard level indefinitely.  
2. **Internet Standard (STD):** This is the highest level of maturity. To advance a specification from Proposed Standard to Internet Standard, it must meet a stringent set of criteria. The key requirement is proof of successful real-world use: there must be "at least two independent interoperating implementations with widespread deployment and successful operational experience". This requirement is the ultimate validation of a specification's clarity, completeness, and utility.

Notably, a third, intermediate level called "Draft Standard" was part of the process for many years. However, in 2011, RFC 6410 deprecated this stage. The rationale was that the process had become an impediment, with very few specifications ever advancing beyond Proposed Standard. This change reflects the IETF's pragmatic character; the community recognized a part of its own process was not achieving its intended goal and re-engineered it to be more effective. This move simplified the track and refocused the ultimate goal on achieving widespread, interoperable deployment as the true measure of a standard's success.

### **2.2 The Unwritten Constitution: "Rough Consensus and Running Code"**

Underpinning the formal stages of the standards track is the IETF's guiding philosophy, famously summarized as "rough consensus and running code." This mantra, articulated in documents like RFC 1958, is the cultural bedrock of the organization.  

**Rough Consensus:** This is a deliberately fuzzy term. It does not mean majority rule or unanimity. Instead, it is a judgment call made by the Working Group chair and the IESG, signifying that all technical arguments have been heard and addressed, and that the group as a whole is willing to move forward with the decision. This approach prevents a simple majority from railroading a proposal over the valid technical objections of a minority. It forces discussion and compromise, leading to more robust and well-considered outcomes.  

**Running Code:** This is the IETF's ultimate arbiter of truth. The principle is that real-world implementation and testing experience is more valuable than theoretical perfection. A protocol design that looks elegant on paper but is impossible to implement efficiently or interoperably is of no value. Therefore, discussions are heavily grounded in implementation experience. Prototypes and experimental deployments provide crucial feedback that shapes the final specification. The "running code" principle is the force that keeps the IETF process tethered to engineering reality.  

This entire process can be viewed as a form of evolutionary algorithm for protocol design. The vast number of competing Internet-Drafts submitted by individuals introduces **variation** into the ecosystem. The rigorous debate and the requirement for "rough consensus" within Working Groups acts as the **selection** mechanism, filtering out weaker or less-supported ideas. The real-world Internet serves as the **environment**, and the "running code" principle, culminating in the requirement for multiple independent and interoperable implementations, is the ultimate **fitness test**. A protocol that cannot be successfully implemented and deployed to interoperate in this environment is deemed "unfit" and will not evolve to the status of an Internet Standard. This relentless evolutionary pressure is what ensures IETF standards are not just abstract ideals, but robust, practical, and scalable engineering artifacts.

### **2.3 Best Current Practice (BCP): Codifying the Process and Wisdom**

The IETF uses its own RFC publication system to document its own rules and procedures. This is done through the Best Current Practice (BCP) subseries of RFCs. A BCP is a formal document, just like a standard, but its purpose is to specify a process or a widely agreed-upon best practice rather than a wire protocol.  

The canonical example is RFC 2026, which is also BCP 9\. This document is "The Internet Standards Process" itself, defining the very maturity levels and procedures described in this section. By codifying its own constitution in a BCP, the IETF ensures that its governance is transparent and subject to the same mechanisms of consensus, review, and revision as the technical standards it produces. BCPs also serve to document operational best practices, such as recommendations for network address translation (NAT) behavior or security considerations for protocol designers. In essence, BCPs form the "meta-layer" of the IETF's dependency graph, defining the rules of the game for all other standards development.  

The evolution of the standards process itself, such as the deprecation of the "Draft Standard" level, reveals a significant philosophical shift. The original three-stage process resembled a traditional waterfall development model, with a linear progression through distinct, gated phases. The observation in RFC 6410 that this process had become a bottleneck, with most specifications stalling at the "Proposed" level, triggered a re-evaluation. By simplifying the track to two levels and elevating the importance of "widespread deployment and successful operational experience" as the key criterion for advancement, the IETF effectively embraced a more iterative, agile-like philosophy. The focus shifted from attempting to perfect a specification in isolation to validating it through continuous feedback from the real world. This demonstrates the IETF's remarkable capacity for self-correction, applying its engineering mindset not only to its protocols but to its own operational framework.

## **III. Defining Boundaries: The Symbiotic Relationship of Requirements and Specifications**

A central point of inquiry is the relationship between "requirements" and "design specifications" within the IETF framework. In many corporate or academic software engineering environments, these are treated as distinct artifacts, often produced by different teams at different stages of a project lifecycle. A requirements document outlines *what* the system must do, while a specification details *how* it will be built. The IETF model does not adhere to this strict separation.

### **3.1 The False Dichotomy: Why the IETF Doesn't Separate "Requirements" and "Specifications"**

In the IETF's methodology, the specification *is* the embodiment of the requirements. The documents it produces, particularly those on the standards track, are described as "technical specifications" that define "methods, behaviors, research, or innovations". Within these very documents, the word "requirements" is used pervasively to describe the normative behavior of a compliant implementation. The distinction is not one of document type but of abstraction and scope. A single RFC, which is a specification, contains a multitude of individual requirements.  

For example, the specification for the Internet Protocol (IP), RFC 791, does not have a separate "IP Requirements" document that precedes it. Instead, RFC 791 itself specifies the requirements for any system that wishes to implement IP, such as the requirement to decrement the Time to Live (TTL) field at each hop or the requirement to verify the header checksum. The specification and the requirements are one and the same.

### **3.2 RFC 2119: The Lexicon of Normative Requirements**

The seamless integration of requirements into specifications is made possible by a crucial document: RFC 2119, "Key words for use in RFCs to Indicate Requirement Levels," which holds the status of a Best Current Practice (BCP 14). This RFC defines the precise, unambiguous meaning of a set of capitalized keywords that are used to signify the level of obligation associated with a particular statement. The key terms are :

* **MUST**, **REQUIRED**, **SHALL**: These terms mean that the definition is an absolute requirement of the specification. A compliant implementation must adhere to it without exception.  
* **MUST NOT**, **SHALL NOT**: These terms mean that the definition is an absolute prohibition.  
* **SHOULD**, **RECOMMENDED**: These terms indicate that a particular course of action is strongly advised. There may be valid reasons to deviate in specific circumstances, but the implementer must understand and weigh the full implications of doing so.  
* **SHOULD NOT**, **NOT RECOMMENDED**: This phrase indicates that a certain behavior is undesirable. While there may be valid reasons to implement it, the implications should be carefully considered.  
* **MAY**, **OPTIONAL**: These terms signify an item that is truly optional. An implementation can choose to include or omit the feature without sacrificing compliance. However, an implementation that includes the option MUST be prepared to interoperate with one that does not, and vice versa.

RFC 2119 is the Rosetta Stone for interpreting IETF specifications. It provides a formal, standardized language for embedding binding requirements directly into descriptive prose. When an author writes, "The client MUST send a SYN packet," they are not merely describing typical behavior; they are stating a testable, verifiable requirement that is binding on any implementation claiming conformance to that specification. This formalization of language is what allows for the creation of independent but fully interoperable systems. It is, in effect, a "protocol for writing protocols."

### **3.3 Two Modes of Requirement Specification**

While the IETF does not separate requirements and specifications into different documents, it does produce documents that serve different functions in defining requirements. These can be broadly categorized into two modes:  

**Mode 1: Protocol-Centric Specifications** These are the foundational documents that define a single protocol from first principles. Examples include RFC 791 (IP), RFC 793 (TCP), and the modern RFC 9000 (QUIC). These specifications detail the on-the-wire format of protocol data units (e.g., packet headers), the state machines that govern connections, and the precise operational behavior required. The requirements in these documents are granular and protocol-specific. For instance, RFC 791's statement that if the header checksum fails, "the internet datagram is discarded at once," is a direct, low-level requirement embedded within the protocol's operational description.  

**Mode 2: Architectural and Functional Requirements** A second class of documents serves to aggregate, clarify, and supplement the requirements of existing protocols for a specific functional role. The canonical examples are RFC 1122, "Requirements for Internet Hosts \-- Communication Layers," and its companion, RFC 1123, "...Application and Support". These documents do not define a new protocol. Instead, their stated purpose is to "incorporate by reference, amend, correct, and supplement the primary protocol standards documents".  

RFC 1122 acts as a "meta-specification" or a "requirements overlay." It takes the foundational specifications for IP (RFC 791\) and TCP (RFC 793\) and adds a layer of requirements necessary for building a compliant Internet host. For example, it might clarify an ambiguity discovered in the original TCP specification or elevate a feature that was "OPTIONAL" in the base protocol to "SHOULD" or "MUST" for host implementations. The very existence of documents like RFC 1122 demonstrates a crucial feedback loop in the IETF process. As multiple independent parties build implementations based on the original specifications, they inevitably discover ambiguities, gaps, or underspecified edge cases. A "Requirements for Hosts" RFC is the formal mechanism for capturing the collective wisdom gained from this widespread implementation experience and feeding it back into the standards track. It does not replace the original protocol specification but refines and strengthens it, showing that the dependency graph includes not just versioning but also clarification and consolidation of best practices.  

To clarify these distinct roles, the following table provides a functional taxonomy of IETF documents.  
**Table 1: A Taxonomy of IETF Documents by Function**

| Document Archetype | Key RFC Example(s) | Primary Purpose | Nature of Requirements |
| :---- | :---- | :---- | :---- |
| **Foundational Protocol Specification** | RFC 791 (IP), RFC 9000 (QUIC) | Define the on-the-wire format and behavioral state machine of a single protocol. | Granular, protocol-specific MUSTs and SHOULDs (e.g., "the TTL field MUST be decremented"). |
| **Architectural Requirements Aggregator** | RFC 1122 (Host Requirements) | Define the required behavior of a complex system (e.g., a host) by clarifying and supplementing multiple underlying protocol specifications. | Higher-level, functional requirements (e.g., "a host SHOULD implement Path MTU Discovery"). |
| **Procedural Standard** | RFC 2026 (The Internet Standards Process) | Define the human and organizational processes for creating standards. | Rules for people and organizations (e.g., "the IESG shall determine the scope..."). |
| **Normative Language Definition** | RFC 2119 (Keywords for Requirement Levels) | Define the precise meaning of words used to express requirements in other specifications. | Meta-requirements about the language of other specifications. |

## **IV. The Principle of Implementation Independence: Specifying Behavior, Not Blueprints**

The assertion that IETF specifications are "implementation independent" is not only correct but is a central, guiding principle of the entire standards process. This principle dictates that a specification should define the externally observable characteristics of a protocol—the "what"—without prescribing the internal architecture or implementation details—the "how." This separation is crucial for fostering innovation, competition, and a diverse technological ecosystem.

### **4.1 The Golden Rule: The "What," Not the "How"**

The commitment to implementation independence is explicitly codified. RFC 2119, after defining the normative keywords, provides a crucial limitation on their use: "they must not be used to try to impose a particular method on implementors where the method is not required for interoperability". This statement draws a clear boundary. A specification can and must dictate behavior that affects interoperability. For example, a security protocol specification *MUST* mandate a specific cryptographic algorithm (e.g., AES-GCM) and key exchange method to ensure that two different implementations can communicate securely. However, that same specification *MUST NOT* dictate which programming language to use, which cryptographic library to link against, or what internal data structures to employ. These are local implementation choices that have no bearing on what is transmitted on the wire.  

This principle remains a core tenet of modern IETF work. An Internet-Draft discussing best practices for public APIs states, "The interface... should be defined by a formal specification, not the behaviour of an implementation... In particular, the implementation of the API server should not be tightly coupled to the API's definition". The document goes on to explain that this approach ensures "substitutability" and "equal access," allowing multiple parties to implement the specification on equal footing. This is not merely a technical preference; it is a foundational choice that enables a competitive and open market. If a standard were defined by a single reference implementation, it would grant the creator of that implementation a permanent and insurmountable advantage. By specifying only the interoperable behavior, the IETF creates a level playing field where anyone, from a large hardware vendor to an open-source project, can compete by creating a compliant implementation. This competition, in turn, is a powerful driver of innovation in performance, security, and features.

### **4.2 Architectural Reinforcement: The End-to-End Argument**

The principle of implementation independence is also reinforced by the core architectural philosophy of the Internet itself. RFC 1958, "Architectural Principles of the Internet," highlights the importance of the "end-to-end argument". This principle suggests that functions like reliability, flow control, and error correction should be implemented in the end systems (the hosts) rather than in the intermediate network nodes (the routers) whenever possible. The job of the network core should be kept as simple as possible: primarily, to forward packets toward their destination.  

This architectural choice naturally promotes implementation independence. By pushing complexity to the endpoints, the system becomes highly modular. The network's routers do not need to know or care about the internal workings of the TCP stack on a connected host; they only need to understand how to route the IP packets that encapsulate the TCP segments. This decoupling at an architectural level is a powerful enforcer of implementation independence, as it minimizes the assumptions that different layers and components of the system need to make about one another.

### **4.3 The Ultimate Litmus Test: Two Independent Implementations**

While philosophical principles and architectural choices are important, the IETF enforces implementation independence through a concrete, practical test. As noted previously, the mandatory requirement for advancing a protocol to the highest maturity level, Internet Standard, is the demonstration of "at least two independent and inter-operable implementations".  

This requirement is the ultimate validation of a well-written, implementation-independent specification. If two separate engineering teams, working in isolation and using only the text of the RFC as their guide, can produce two distinct pieces of software that successfully communicate with each other, it serves as definitive proof of two critical properties:

1. **Clarity:** The specification is sufficiently clear and unambiguous that its requirements were interpreted consistently by both teams.  
2. **Abstraction:** The specification is sufficiently abstract that it did not force both teams into a single, identical internal design.

Failure to meet this test reveals flaws in the specification itself, which must then be revised and clarified. This practical, results-oriented enforcement mechanism is far more effective than any abstract policy statement could ever be.  

A pragmatic corollary to this principle is Postel's Law, also known as the Robustness Principle, articulated in RFC 1958: "Be strict when sending and tolerant when receiving". This principle acknowledges that in a world of diverse, independent implementations, minor bugs and slight deviations from the specification are inevitable. Postel's Law provides an engineering guideline for building a robust system in the face of this reality. A "strict" sender ensures its own transmissions are as compliant as possible. A "tolerant" receiver is designed to accept and process messages that may be slightly malformed, as long as the intent is clear. This prevents the entire system from becoming brittle, where a minor error from one implementation could cause a catastrophic failure in another. It is the practical acknowledgment that allows a vast ecosystem of independent implementations to function and interoperate without demanding flawless perfection from every participant.

## **V. Mapping the Graph of Dependencies**

The user's request to understand the "graph of dependencies" is insightful, as the IETF's stability and evolutionary capacity are rooted in a multi-layered system of interdependent relationships. This graph is not a single entity but a composite of at least three distinct, interlocking graphs: the Document Graph, the Procedural Graph, and the Architectural Graph.

### **5.1 The Document Graph: A Chain of Evolution and Clarification**

The most explicit dependency graph is the one connecting the RFC documents themselves. The immutability of RFCs, combined with the formal "updates" and "obsoletes" relationships, creates a formal, directed acyclic graph (DAG) of documentation. This graph allows anyone to trace the precise lineage of any major Internet protocol.  

For example, the specification for TCP did not remain static after its initial publication in RFC 793 in 1981\. Its evolution can be traced through the Document Graph:

* **RFC 793:** Establishes the foundational protocol.  
* **RFC 1122:** *Updates* RFC 793 by clarifying requirements for host implementations.  
* **RFC 6093:** *Updates* RFC 793 by clarifying aspects of TCP's state machine.  
* **RFC 9293:** Finally *obsoletes* RFC 793, consolidating it and dozens of updates into a new, modern baseline specification.

This graph is not merely a historical record; it is a normative map. A modern engineer implementing TCP must consult RFC 9293, not the original RFC 793, because the graph explicitly defines the current state of the standard. The IETF Datatracker and RFC Editor websites make this graph navigable, providing explicit forward and backward links for every document.

### **5.2 The Procedural Graph: A Funnel of Consensus**

The second graph maps the human and organizational processes required to create a standard. This is a workflow dependency graph where each stage is a prerequisite for the next. The path from idea to standard is a sequence of dependencies :

1. An idea is formulated and written as an **Internet-Draft (I-D)**.  
2. The I-D is submitted to a relevant **Working Group (WG) mailing list** for discussion.  
3. If the idea gains traction, the WG may formally **adopt the draft**, making it a collective work item.  
4. The WG iterates on the draft until it achieves **rough consensus**.  
5. The draft is submitted for an **IETF Last Call**, a final review period for the entire IETF community.  
6. The draft undergoes formal review by the **Internet Engineering Steering Group (IESG)**.  
7. Upon IESG approval, the draft is passed to the **RFC Editor for publication**.

This procedural graph acts as a series of quality gates. A failure to clear any one of these gates—for instance, a failure to achieve rough consensus in the WG—terminates that branch of the graph for that particular draft. This ensures that any document that successfully navigates the entire graph has been subjected to extensive peer review and has demonstrated broad community support.

### **5.3 The Architectural Graph: A Protocol Stack**

The third graph is the familiar layered architecture of the Internet protocol suite. This is a graph of functional dependencies, where protocols at one layer rely on the services provided by the protocols at the layer below. The specifications themselves explicitly define these relationships.

* RFC 791 (IP) states that it is a service "called on by host-to-host protocols" (like TCP) and, in turn, "calls on local network protocols" (like Ethernet) to carry its datagrams.  
* RFC 793 (TCP) specifies that it fits "just above a basic Internet Protocol".  
* More recently, RFC 9114 (HTTP/3) is explicitly defined as a "mapping of HTTP semantics over the QUIC transport protocol".

This layered dependency graph is a cornerstone of the Internet's design, embodying the principle of modularity. It allows for independent evolution at different layers. For example, the development of Wi-Fi as a new link layer did not require any changes to the IP or TCP protocols. Similarly, the creation of HTTP/3 over QUIC was possible without altering the underlying IP layer.  

These three graphs are not independent but are interlocking and co-evolving. They are different projections of the same underlying evolutionary process. A new requirement in the **Architectural Graph** (e.g., the need for a transport protocol that avoids head-of-line blocking for HTTP/2) triggers a new process in the **Procedural Graph** (the formation of the QUIC Working Group). This procedure, in turn, generates a new and complex subgraph within the **Document Graph** (the set of RFCs defining QUIC and HTTP/3). Understanding this dynamic interplay is essential to grasping the holistic nature of the IETF's system for managing technological change.  

Furthermore, the non-standards-track RFCs play a vital role in this ecosystem. Using a software development analogy, "Experimental" and "Informational" RFCs can be seen as the "feature branches" of the Document Graph. In Git, feature branches are used to develop and test new ideas in isolation before they are considered for merging into the main development branch. Similarly, Experimental RFCs provide a formal venue for testing novel protocol ideas that might one day be ready for the standards track. Informational RFCs can document proprietary protocols or alternative approaches that are valuable to the community but are not on a path to standardization. These documents allow for innovation and the public recording of ideas without polluting the "main branch" of formal Internet Standards, representing potential future directions and documenting the broader context in which standards are developed.

## **VI. Case Study: The Evolution from TCP to QUIC**

The principles of requirements, specifications, implementation independence, and the multi-layered dependency graph can be best understood through a concrete example. The decades-long evolution of the Internet's transport layer, from the creation of TCP to the recent standardization of QUIC, provides a compelling case study.

### **6.1 TCP: A Foundation Laid and Refined (RFC 793 to RFC 9293\)**

The Transmission Control Protocol is a foundational component of the Internet. Its journey illustrates the IETF's capacity for long-term maintenance and refinement of a critical standard.

* **Initial Specification:** The core protocol was defined in RFC 793 in 1981, which was also designated as Internet Standard 7 (STD 7). This document is a classic "Protocol-Centric Specification," defining TCP's header format, state machine, and mechanisms for providing a reliable, ordered, connection-oriented byte stream service.  
* **Architectural Requirements:** As implementations proliferated, operational experience revealed ambiguities and areas for improvement. In 1989, RFC 1122, "Requirements for Internet Hosts," was published as STD 3\. This "Architectural Requirements Aggregator" did not replace RFC 793 but formally updated it, clarifying specific behaviors and setting mandatory requirements for any system claiming to be a compliant Internet host. This demonstrates a direct interaction between the Architectural Graph (defining the behavior of a "host") and the Document Graph (formally updating the base protocol spec).  
* **Incremental Evolution:** Over the subsequent three decades, dozens of RFCs further updated TCP. These introduced critical features that are now considered standard, such as sophisticated congestion control algorithms (e.g., Reno, NewReno), Explicit Congestion Notification (ECN), and various performance enhancements. Each of these RFCs represents a node in the Document Graph, branching off from and adding to the foundational specification.  
* **Modernization:** By the 2020s, the complete specification for a modern TCP implementation was scattered across dozens of documents. To address this, the IETF published RFC 9293 in 2022\. This document's explicit purpose was to "bring together all of the IETF Standards Track changes and other clarifications... into an updated version of the specification". It formally obsoleted RFC 793, providing a new, consolidated baseline for TCP. This act represents a major "refactoring" of the standard, demonstrating the Document Graph's ability to manage not just incremental change but also periodic consolidation over very long timescales.

### **6.2 QUIC: A Modern Protocol Born from Experience (RFC 9000 Series)**

The development of QUIC is a case study in how the IETF creates a new protocol to address the limitations of an existing one, embodying the lessons learned over decades.

* **Architectural Motivation:** The primary driver for QUIC was the "head-of-line blocking" problem in HTTP/2 when run over TCP. Because TCP provides a single, strictly ordered byte stream, the loss of a single TCP segment can stall the delivery of all multiplexed HTTP/2 streams, even those whose data has already been received. This architectural problem demanded a new transport protocol.  
* **The Procedural Path:** The protocol began as an experiment at Google. Recognizing its potential, Google brought the specification to the IETF, where a dedicated QUIC Working Group was chartered in 2016 to shepherd it through the formal standards process. This follows the standard Procedural Graph, moving from a single-vendor experiment to a multi-stakeholder, consensus-driven standard.  
* **A Modular Specification:** The design of QUIC is a direct response to the limitations discovered in TCP. Problems like TCP's cleartext header, which made it vulnerable to "ossification" by network middleboxes that would inspect and sometimes mishandle its fields, were addressed from first principles. QUIC's headers are almost entirely encrypted, preventing such interference. The head-of-line blocking issue was solved by making streams a first-class citizen of the transport layer, allowing data from one stream to be processed even if a packet from another stream is lost. This demonstrates the IETF's long-term learning feedback loop, where decades of operational experience with one protocol directly inform the design of its successor.  
* **Evolution in Specification Practice:** Unlike the monolithic RFC 793, the QUIC v1 standard was deliberately published as a modular set of interdependent documents, representing an evolution in the practice of specification itself :  
  * **RFC 9000:** Defines the core transport protocol, including streams, flow control, and connection management.  
  * **RFC 9001:** Specifies the integration of TLS 1.3 for security, key negotiation, and authentication.  
  * **RFC 9002:** Details the mechanisms for loss detection and congestion control.

This modular design reflects modern software engineering principles like separation of concerns. It allows different facets of the protocol to be understood and even evolved independently. A new congestion control algorithm, for example, could be specified in a future RFC that updates only RFC 9002, without requiring any changes to the core transport logic in RFC 9000\.

* **Enabling the Next Layer:** The standardization of QUIC directly enabled the next layer of the Architectural Graph. RFC 9114 defines HTTP/3 as a mapping of HTTP semantics over QUIC. This completes the cycle: an application-layer problem (in HTTP/2) drove the creation of a new transport-layer protocol (QUIC), which in turn enabled a new application-layer protocol (HTTP/3).

## **Conclusion**

The analysis of the Internet Engineering Task Force's standards process reveals a sophisticated and resilient system for collaborative engineering. The relationship between requirements and specifications is not a dichotomy but a deeply integrated symbiosis. Specifications are the primary vehicle for conveying requirements, which are made explicit, testable, and unambiguous through the formal, normative language defined in RFC 2119\. This approach avoids the disconnect that often plagues development models where requirements and design are treated as separate, sequential artifacts.  

The user's hypothesis that specifications are "implementation independent" is correct and stands as a central pillar of the IETF's philosophy. This principle is not merely a passive guideline but an actively enforced mandate. It is encouraged architecturally by the end-to-end argument, which favors modularity and decoupling. It is codified explicitly in the rules governing the use of normative language. Most importantly, it is proven practically by the non-negotiable requirement for multiple, independent, and interoperable implementations before a protocol can achieve the status of an Internet Standard. This rigorous enforcement fosters a competitive and innovative ecosystem, preventing vendor lock-in and ensuring the long-term health of the Internet.  

The "graph of dependencies" is a powerful, multi-layered construct for understanding the IETF's holistic system. The Document Graph provides a stable, versioned history of the standards themselves. The Procedural Graph ensures that every standard is the product of extensive peer review and broad consensus. The Architectural Graph provides the modular, layered structure that allows the Internet to evolve without collapsing. The dynamic interplay between these three graphs creates a robust, self-correcting, and evolutionary system that has allowed the Internet to scale and adapt for over fifty years. The IETF has engineered not just a set of protocols, but a system for managing their continuous evolution in a stable and predictable manner. The true product of the IETF is not merely a library of documents, but a living architecture of consensus that remains one of the most successful collaborative technology projects in human history.

#### **Works cited**

1. Introduction to the IETF, https://www.ietf.org/about/introduction/
2. The IETF process: an informal guide, https://www.ietf.org/process/informal/
3. RFC 1958 \- Architectural Principles of the Internet \- IETF Datatracker, https://datatracker.ietf.org/doc/rfc1958/
4. Request for Comments \- Wikipedia, https://en.wikipedia.org/wiki/Request\_for\_Comments
5. About RFCs \- IETF, https://www.ietf.org/process/rfcs/
6. Choosing between Informational and Experimental Status \- IETF, https://www.ietf.org/process/process/informational-vs-experimental/
7. The "simple" 38 step journey to getting an RFC \- Benjojo's Blog, https://blog.benjojo.co.uk/post/rfc-in-38-simple-steps
8. IETF and the RFC Standards Process \- catb. Org, http://www.catb.org/esr/writings/taoup/html/ietf\_process.html
9. RFC 9281: Entities Involved in the IETF Standards Process, https://www.rfc-editor.org/rfc/rfc9281.pdf
10. Internet standards process \- IETF, https://www.ietf.org/process/process/
11. RFC 9293: Transmission Control Protocol (TCP), https://www.rfc-editor.org/rfc/rfc9293.html
12. RFC 793 (Obsoleted: Sep 1981 \- Aug 2022, 91 pages) \- Tech-invite, https://www.tech-invite.com/y05/tinv-ietf-rfc-0793.html
13. Internet Standard \- Wikipedia, https://en.wikipedia.org/wiki/Internet\_Standard
14. RFC 6410: Reducing the Standards Track to Two Maturity Levels, https://www.rfc-editor.org/rfc/rfc6410.html
15. Implementation reports \- IETF, https://www.ietf.org/participate/runningcode/implementation-reports/
16. Best Current Practices \- IETF Datatracker, https://datatracker.ietf.org/doc/bcp
17. RFC 791 \- Internet Protocol \- IETF Datatracker, https://datatracker.ietf.org/doc/html/rfc791
18. RFC 2119 \- Key words for use in RFCs to Indicate Requirement Levels \- IETF Datatracker, https://datatracker.ietf.org/doc/html/rfc2119
19. "Key words for use in RFCs to Indicate Requirement Levels", BCP 14 \- IETF, https://www.ietf.org/rfc/rfc2119.txt
20. RFC 793 \- Transmission Control Protocol (TCP) \- IETF, https://www.ietf.org/rfc/rfc793.txt
21. RFC 9000 \- QUIC: A UDP-Based Multiplexed and Secure Transport \- IETF Datatracker, https://datatracker.ietf.org/doc/html/rfc9000
22. RFC 791: Internet Protocol, https://www.rfc-editor.org/rfc/rfc791.html
23. RFC 1122 \- Requirements for Internet Hosts \- Communication Layers \- IETF Datatracker, https://datatracker.ietf.org/doc/html/rfc1122
24. RFC 1123 \- Requirements for Internet Hosts \- Application and Support \- IETF Datatracker, https://datatracker.ietf.org/doc/rfc1123/
25. RFC 1127: Perspective on the Host Requirements RFCs, https://www.rfc-editor.org/rfc/rfc1127.html
26. Public API Principles, https://mnot.github.io/I-D/draft-nottingham-public-apis.html
27. RFC 9114 \- HTTP/3 \- IETF Datatracker, https://datatracker.ietf.org/doc/html/rfc9114
28. RFC 793 \- freesoft.org, https://www.freesoft.org/CIE/RFC/793/
29. Chapter 17\. TCP: Transmission Control Protocol, http://isp.vsi.ru/library/Networking/TCPIPIllustrated/tcp\_tran.htm
30. QUIC \- Wikipedia, https://en.wikipedia.org/wiki/QUIC
31. QUIC Working Group, https://quicwg.org/
32. RFC 9001 \- Using TLS to Secure QUIC \- IETF Datatracker, https://datatracker.ietf.org/doc/rfc9001/
33. IETF QUIC v1 Design, https://www.cse.wustl.edu/\~jain/cse570-21/ftp/quic/index.html
