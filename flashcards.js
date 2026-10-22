
const FLASHCARDS = [
  {
    topic: "Cloud concepts",
    front: "What is cloud computing?",
    back: "The delivery of computing services such as servers, storage, databases, networking, and software over the internet."
  },
  {
    topic: "Cloud concepts",
    front: "What is the shared responsibility model?",
    back: "A model that divides security and operational responsibilities between the cloud provider and the customer. The division depends on the service type."
  },
  {
    topic: "Cloud concepts",
    front: "What is high availability?",
    back: "Designing services to remain accessible with minimal downtime, often by using redundancy and resilient architecture."
  },
  {
    topic: "Cloud concepts",
    front: "What is scalability?",
    back: "The ability to increase or decrease resources to meet changing workloads."
  },
  {
    topic: "Cloud concepts",
    front: "What is elasticity?",
    back: "The ability to automatically or dynamically add and remove resources as demand changes."
  },
  {
    topic: "Cloud concepts",
    front: "What is CapEx?",
    back: "Capital expenditure: upfront spending on physical assets such as servers and data-centre equipment."
  },
  {
    topic: "Cloud concepts",
    front: "What is OpEx?",
    back: "Operational expenditure: ongoing spending for services or resources consumed over time."
  },
  {
    topic: "Cloud concepts",
    front: "What is the consumption-based model?",
    back: "A pricing approach where customers pay for the cloud resources they use rather than purchasing all infrastructure upfront."
  },
  {
    topic: "Cloud concepts",
    front: "What is IaaS?",
    back: "Infrastructure as a Service. The provider supplies infrastructure such as virtual machines and networking, while customers manage the operating system and applications."
  },
  {
    topic: "Cloud concepts",
    front: "What is PaaS?",
    back: "Platform as a Service. The provider manages the underlying infrastructure and platform so customers can focus on developing and deploying applications."
  },
  {
    topic: "Cloud concepts",
    front: "What is SaaS?",
    back: "Software as a Service. The provider operates an application that customers access, usually through a browser or app."
  },
  {
    topic: "Cloud concepts",
    front: "What is a hybrid cloud?",
    back: "An approach that combines private infrastructure with public cloud services."
  },
  {
    topic: "Azure architecture and services",
    front: "What is an Azure region?",
    back: "A geographic area containing one or more Azure datacentres connected through a low-latency network."
  },
  {
    topic: "Azure architecture and services",
    front: "What is an availability zone?",
    back: "A physically separate location within an Azure region, with independent power, cooling, and networking."
  },
  {
    topic: "Azure architecture and services",
    front: "What is an Azure resource?",
    back: "An individual manageable item in Azure, such as a virtual machine, storage account, or virtual network."
  },
  {
    topic: "Azure architecture and services",
    front: "What is a resource group?",
    back: "A logical container for Azure resources that you manage together."
  },
  {
    topic: "Azure architecture and services",
    front: "What is an Azure subscription?",
    back: "A logical boundary for resource management and billing that also provides an administrative scope for access and policies."
  },
  {
    topic: "Azure architecture and services",
    front: "What is a management group?",
    back: "A container used to organise multiple Azure subscriptions and apply governance controls across them."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure Virtual Machines?",
    back: "An Azure compute service that provides virtualised servers with control over the operating system and installed software."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure App Service?",
    back: "A platform service for hosting web apps, REST APIs, and mobile back ends without managing the underlying servers."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure Functions?",
    back: "A serverless compute service that runs code in response to events or triggers."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure Blob Storage?",
    back: "Object storage designed for large amounts of unstructured data, such as images, documents, backups, and media."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure Virtual Network?",
    back: "A service that provides private networking for Azure resources, including IP addressing, subnets, routing, and network security integration."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure VPN Gateway?",
    back: "A service that enables encrypted connectivity between Azure virtual networks and other networks over VPN connections."
  },
  {
    topic: "Azure management and governance",
    front: "What is Microsoft Entra ID?",
    back: "Microsoft's cloud-based identity and access management service for users, groups, applications, and other identities."
  },
  {
    topic: "Azure management and governance",
    front: "What is Azure role-based access control (RBAC)?",
    back: "A system for granting permissions to users, groups, service principals, and managed identities at a defined scope."
  },
  {
    topic: "Azure management and governance",
    front: "What is Azure Policy?",
    back: "A governance service that helps enforce organisational standards and assess compliance of resources."
  },
  {
    topic: "Azure management and governance",
    front: "What are resource locks?",
    back: "Controls that help prevent resources from being accidentally deleted or modified. Common lock types are CanNotDelete and ReadOnly."
  },
  {
    topic: "Azure management and governance",
    front: "What is Azure Cost Management?",
    back: "A set of tools for analysing, monitoring, and managing Azure spending, including budgets and cost alerts."
  },
  {
    topic: "Azure management and governance",
    front: "What is the Azure pricing calculator?",
    back: "A tool for estimating the expected cost of Azure products and services before deployment."
  },
  {
    topic: "Azure management and governance",
    front: "What is the Azure Service Level Agreement (SLA)?",
    back: "A formal commitment describing service availability or performance standards and any applicable terms and remedies."
  },
  {
    topic: "Azure management and governance",
    front: "What is Azure Advisor?",
    back: "A service that provides recommendations to help improve reliability, security, performance, operational excellence, and cost."
  },
  {
    topic: "Azure management and governance",
    front: "What is Azure Monitor?",
    back: "A monitoring service that collects and analyses metrics and logs to help understand the performance and health of applications and infrastructure."
  },
  {
    topic: "Azure management and governance",
    front: "What is Microsoft Purview?",
    back: "A family of data governance solutions that helps organisations understand, govern, and protect their data estate."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure Kubernetes Service (AKS)?",
    back: "A managed Kubernetes service for deploying and operating containerised applications."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure Files?",
    back: "A managed file-share service accessible through standard protocols such as SMB and, in supported configurations, NFS."
  },
  {
    topic: "Azure architecture and services",
    front: "What is Azure ExpressRoute?",
    back: "A service that provides private connectivity between an organisation's network and Microsoft cloud services through a connectivity provider."
  },
  {
    topic: "Cloud concepts",
    front: "What is a public cloud?",
    back: "A cloud model where services are provided over a network by a cloud provider and shared across customers with logical isolation."
  },
  {
    topic: "Cloud concepts",
    front: "What is a private cloud?",
    back: "A cloud environment dedicated to one organisation, hosted on-premises or by a provider."
  },
  {
    topic: "Azure management and governance",
    front: "What is the Microsoft Azure portal?",
    back: "A web-based interface for creating, configuring, monitoring, and managing Azure resources."
  },
  {
    topic: "Azure management and governance",
    front: "What is Azure Cloud Shell?",
    back: "A browser-accessible shell for managing Azure resources using Azure CLI or Azure PowerShell."
  }
];
