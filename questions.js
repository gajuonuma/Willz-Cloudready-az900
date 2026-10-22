
"use strict";

const QUESTIONS = [
    {
        id: 1,
        topic: "cloud",
        question: "What is cloud computing?",
        options: [
            "Delivering computing services over the internet",
            "Using only computers inside an office",
            "Storing all data on USB drives",
            "Building physical servers for every user"
        ],
        correctIndex: 0,
        explanation: "Cloud computing delivers services such as servers, storage, databases and networking over the internet."
    },
    {
        id: 2,
        topic: "cloud",
        question: "Which cloud model combines private infrastructure with public cloud services?",
        options: [
            "Public cloud",
            "Hybrid cloud",
            "Private cloud",
            "Community-free cloud"
        ],
        correctIndex: 1,
        explanation: "A hybrid cloud combines private infrastructure with public cloud services."
    },
    {
        id: 3,
        topic: "cloud",
        question: "Which cloud service model gives you the most control over the operating system?",
        options: [
            "SaaS",
            "PaaS",
            "IaaS",
            "A fully managed business application"
        ],
        correctIndex: 2,
        explanation: "Infrastructure as a Service (IaaS) gives you control over virtual machines and their operating systems, while the provider manages the underlying physical infrastructure."
    },
    {
        id: 4,
        topic: "cloud",
        question: "What is a key benefit of cloud elasticity?",
        options: [
            "Resources can be adjusted as demand changes",
            "Applications never need maintenance",
            "All services become free",
            "Internet access is no longer required"
        ],
        correctIndex: 0,
        explanation: "Elasticity allows resources to expand or contract as workload demand changes."
    },
    {
        id: 5,
        topic: "cloud",
        question: "In the shared responsibility model, who is responsible for protecting the physical datacentre?",
        options: [
            "The customer in every cloud service model",
            "The cloud provider",
            "The application end user",
            "The customer's internet provider"
        ],
        correctIndex: 1,
        explanation: "The cloud provider is responsible for the physical datacentre and underlying infrastructure."
    },
    {
        id: 6,
        topic: "cloud",
        question: "Which pricing approach is commonly associated with public cloud services?",
        options: [
            "Pay only for resources used, where the service's pricing model supports it",
            "Pay the same amount regardless of every service's usage",
            "Purchase a physical server before using any service",
            "Pay only once for all future cloud services"
        ],
        correctIndex: 0,
        explanation: "Many cloud services use consumption-based pricing, although actual charges depend on the service and pricing terms."
    },
    {
        id: 7,
        topic: "architecture",
        question: "What is an Azure region?",
        options: [
            "A Microsoft account password",
            "A geographical area containing one or more datacentres",
            "A type of virtual machine operating system",
            "A billing document"
        ],
        correctIndex: 1,
        explanation: "An Azure region is a geographical area containing one or more datacentres connected through a low-latency network."
    },
    {
        id: 8,
        topic: "architecture",
        question: "Which Azure service provides virtual machines?",
        options: [
            "Azure Policy",
            "Microsoft Entra ID",
            "Azure Virtual Machines",
            "Azure Cost Management"
        ],
        correctIndex: 2,
        explanation: "Azure Virtual Machines provides on-demand virtualised computing resources."
    },
    {
        id: 9,
        topic: "architecture",
        question: "Which Azure service is designed for object storage, such as images and documents?",
        options: [
            "Azure Blob Storage",
            "Azure Virtual Network",
            "Azure DNS",
            "Azure Policy"
        ],
        correctIndex: 0,
        explanation: "Azure Blob Storage stores large amounts of unstructured object data, including images, documents and backups."
    },
    {
        id: 10,
        topic: "architecture",
        question: "What is the main purpose of an Azure Virtual Network?",
        options: [
            "To manage subscription invoices",
            "To provide a logically isolated network for Azure resources",
            "To replace all identity services",
            "To create exam questions"
        ],
        correctIndex: 1,
        explanation: "An Azure Virtual Network enables private networking and communication between Azure resources and supported connected networks."
    },
    {
        id: 11,
        topic: "architecture",
        question: "Which Azure service helps distribute incoming web traffic across backend servers?",
        options: [
            "Azure Load Balancer",
            "Azure Advisor",
            "Azure Policy",
            "Microsoft Purview"
        ],
        correctIndex: 0,
        explanation: "Azure Load Balancer distributes network traffic across backend resources to support availability and performance."
    },
    {
        id: 12,
        topic: "architecture",
        question: "What is an Azure availability zone?",
        options: [
            "A billing category",
            "A separate physical location within an Azure region with independent infrastructure",
            "A user group in Microsoft Entra ID",
            "A type of software licence"
        ],
        correctIndex: 1,
        explanation: "Availability zones are physically separate locations within a region, designed with independent power, cooling and networking."
    },
    {
        id: 13,
        topic: "governance",
        question: "Which Azure service helps enforce organisational rules on resources?",
        options: [
            "Azure Policy",
            "Azure Blob Storage",
            "Azure Virtual Machines",
            "Azure DNS"
        ],
        correctIndex: 0,
        explanation: "Azure Policy evaluates resources against organisational rules and can audit or enforce compliance."
    },
    {
        id: 14,
        topic: "governance",
        question: "What is the main purpose of Microsoft Entra ID?",
        options: [
            "Object storage",
            "Identity and access management",
            "Virtual machine hosting",
            "Network traffic balancing"
        ],
        correctIndex: 1,
        explanation: "Microsoft Entra ID provides identity and access management capabilities for users, applications and resources."
    },
    {
        id: 15,
        topic: "governance",
        question: "Which tool estimates the cost of Azure services before deployment?",
        options: [
            "Azure Pricing Calculator",
            "Azure Service Health",
            "Azure Monitor",
            "Microsoft Entra ID"
        ],
        correctIndex: 0,
        explanation: "The Azure Pricing Calculator helps estimate costs for planned Azure configurations and usage."
    },
    {
        id: 16,
        topic: "governance",
        question: "What does role-based access control (RBAC) help manage?",
        options: [
            "The physical location of datacentres",
            "Who can perform which actions on resources",
            "How quickly a web page loads",
            "The price of every Azure service"
        ],
        correctIndex: 1,
        explanation: "Azure RBAC assigns permissions through roles, helping control who can access resources and what actions they can perform."
    },
    {
        id: 17,
        topic: "governance",
        question: "Which Azure service provides recommendations for improving cost, security, reliability and performance?",
        options: [
            "Azure Advisor",
            "Azure Blob Storage",
            "Azure DNS",
            "Azure Virtual Network"
        ],
        correctIndex: 0,
        explanation: "Azure Advisor analyses resource configurations and usage to provide recommendations across several optimisation areas."
    },
    {
        id: 18,
        topic: "governance",
        question: "Which statement best describes resource locks in Azure?",
        options: [
            "They replace all access permissions",
            "They help prevent resources from being accidentally deleted or modified",
            "They automatically reduce every resource's price",
            "They encrypt every file stored in Azure"
        ],
        correctIndex: 1,
        explanation: "Azure resource locks help protect resources from accidental deletion or modification. They do not replace access control."
    }
];
